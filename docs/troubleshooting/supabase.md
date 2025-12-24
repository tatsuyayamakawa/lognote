# Supabase トラブルシューティング

Supabase の設定、認証、ストレージ、データベースに関する問題の解決方法をまとめています。

## 接続・認証エラー

### "Invalid API key" エラー

**症状**: Supabase クライアントの初期化時にエラー

**原因**:
- 環境変数が設定されていない
- 環境変数の値が間違っている

**解決策**:
```bash
# .env.local を確認
cat .env.local

# 必須の環境変数
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. プロジェクト設定 > API
3. URLとAnon keyをコピーして `.env.local` に貼り付け
4. 開発サーバーを再起動

### ログインできない

**症状**: 管理画面にログインできない

**原因**:
- メール確認が完了していない
- 認証設定が間違っている

**確認事項**:
1. **メール確認**: Supabaseから届いた確認メールのリンクをクリック
2. **認証設定**: Supabase Dashboard > Authentication > Providers で Email が有効か確認
3. **Site URL**: Supabase Dashboard > Authentication > URL Configuration で正しいURLが設定されているか確認

**開発環境の設定**:
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

**本番環境の設定**:
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/**`

---

## データベースエラー

### "Permission denied" エラー

**症状**: テーブルへのクエリで権限エラー

**原因**:
- Row Level Security (RLS) が有効だが、ポリシーが設定されていない
- 認証されていない状態でアクセスしている

**解決策**:

#### RLSポリシーの確認
```sql
-- Supabase Dashboard > SQL Editor で実行
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'your_table_name';
```

#### ポリシーの追加例
```sql
-- 認証済みユーザーのみ読み取り可能
CREATE POLICY "Allow authenticated users to read"
ON your_table_name
FOR SELECT
TO authenticated
USING (true);

-- 自分のデータのみ書き込み可能
CREATE POLICY "Users can insert their own data"
ON your_table_name
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

### マイグレーションが失敗する

**症状**: `supabase db push` でエラー

**原因**:
- SQLの構文エラー
- 既存のテーブル/カラムとの競合
- 依存関係の順序が間違っている

**解決策**:
```bash
# ローカル環境でテスト
supabase db reset

# エラーログを確認
supabase db push --debug

# 特定のマイグレーションのみ実行
supabase migration repair <version>
```

**ベストプラクティス**:
1. マイグレーションファイルは連番で作成（`001_`, `002_`, ...）
2. 各マイグレーションは独立して実行可能にする
3. ロールバック用のマイグレーションも用意する

---

## ストレージエラー

### ファイルアップロードが失敗する

**症状**: 画像やファイルのアップロードで "403 Forbidden" エラー

**原因**:
- ストレージのRLSポリシーが設定されていない
- ファイルサイズ制限を超えている

**解決策**:

#### 1. RLSポリシーの確認
Supabase Dashboard > Storage > Policies で以下を確認:

```sql
-- 認証済みユーザーのアップロード許可
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- 認証済みユーザーの読み取り許可
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');
```

#### 2. ファイルサイズ制限
- Free Plan: 最大50MB
- Pro Plan: カスタマイズ可能

**実装側での制限**:
```typescript
// 例: 10MBまで
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

if (file.size > MAX_FILE_SIZE) {
  throw new Error('ファイルサイズは10MB以下にしてください');
}
```

### アップロードしたファイルが表示されない

**症状**: ファイルのURLにアクセスしても404エラー

**原因**:
- バケットが公開設定になっていない
- URLが間違っている

**解決策**:

#### バケットを公開にする
1. Supabase Dashboard > Storage
2. バケット（例: `images`）を選択
3. 「Make public」をクリック

#### 正しいURL形式
```typescript
// ✅ 正しい
const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${fileName}`;

// ❌ 間違い
const url = `/storage/images/${fileName}`;
```

---

## パフォーマンス問題

### クエリが遅い

**症状**: データの取得に時間がかかる

**解決策**:

#### 1. インデックスの追加
```sql
-- よく検索されるカラムにインデックスを追加
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
```

#### 2. 必要なカラムのみ取得
```typescript
// ❌ すべてのカラムを取得
const { data } = await supabase.from('posts').select('*');

// ✅ 必要なカラムのみ
const { data } = await supabase
  .from('posts')
  .select('id, title, slug, published_at');
```

#### 3. ページネーション
```typescript
const { data } = await supabase
  .from('posts')
  .select('*')
  .range(0, 9)  // 最初の10件
  .order('published_at', { ascending: false });
```

### "Too many connections" エラー

**症状**: 同時接続数の上限に達した

**原因**:
- Free Plan: 最大60接続
- コネクションプールの設定ミス

**解決策**:

#### Supabaseクライアントのシングルトン化
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

let supabase: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabase;
}
```

---

## セキュリティ警告

### "Function search_path vulnerability" 警告

**症状**: Supabase Dashboard のセキュリティアドバイザーで警告

**解決策**:
マイグレーションファイル `004_fix_function_security.sql` を適用:

```bash
supabase db push
```

このマイグレーションは自動的に関数の`search_path`を修正します。

### "Leaked password protection" 警告

**重要**: この機能は **Pro Plan以上** でのみ利用可能です。

**Free Planでの代替策**:
1. 強力なパスワードポリシーを推奨
2. パスワードマネージャーの使用を推奨
3. 多要素認証（MFA）の実装を検討

詳細は [Supabaseセキュリティ設定](../setup/03-supabase-security-setup.md) を参照してください。

---

## 開発環境の問題

### ローカル環境とリモート環境でデータが異なる

**原因**:
- ローカルとリモートのデータベースが同期されていない

**解決策**:

#### リモートのデータをローカルに反映
```bash
# リモートのスキーマをダンプ
supabase db dump -f schema.sql

# ローカルに適用
supabase db reset
```

#### ローカルのマイグレーションをリモートに適用
```bash
supabase db push
```

### 環境変数が反映されない

**確認事項**:
```bash
# .env.local を確認
cat .env.local

# 開発サーバーを完全に再起動
# Ctrl+C で停止
npm run dev
```

**注意**:
- `.env.local` は `.gitignore` に含める
- Vercel等の本番環境では、環境変数を手動で設定

---

## 関連ドキュメント

### セットアップガイド
- [Supabase基本設定](../setup/01-supabase-setup.md)
- [Supabaseストレージ設定](../setup/02-supabase-storage-setup.md)
- [Supabaseセキュリティ設定](../setup/03-supabase-security-setup.md)

### その他のトラブルシューティング
- [Analytics トラブルシューティング](analytics.md)
- [AdSense トラブルシューティング](adsense.md)
