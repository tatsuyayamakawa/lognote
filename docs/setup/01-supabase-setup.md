# Supabase セットアップガイド

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセス
2. アカウント作成 or ログイン
3. 「New Project」をクリック
4. プロジェクト情報を入力:
   - Name: `bodycare-yumin-blog`
   - Database Password: 強力なパスワードを設定（メモしておく）
   - Region: `Northeast Asia (Tokyo)` を選択
   - Pricing Plan: `Free` を選択
5. 「Create new project」をクリック

## 2. データベースのセットアップ

プロジェクト作成後、SQLエディタでスキーマを実行します。

1. 左サイドバーから「SQL Editor」を選択
2. 「New Query」をクリック
3. `supabase/migrations/001_initial_schema.sql` の内容をコピー＆ペースト
4. 「Run」をクリックして実行

### 確認方法
- 左サイドバー「Table Editor」でテーブルが作成されているか確認
- 以下のテーブルが存在するはず:
  - `posts`
  - `categories` (初期データも挿入済み)
  - `post_categories`
  - `analytics_cache`

## 3. 環境変数の設定

1. Supabaseプロジェクトの「Settings」→「API」へ移動
2. 以下の情報をコピー:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. `.env.local`ファイルを編集:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. 認証設定

### Email認証の有効化

1. 「Authentication」→「Providers」へ移動
2. 「Email」が有効になっていることを確認
3. 「Email Auth」の設定:
   - Confirm email: `OFF`（開発時）※本番では`ON`推奨
   - Secure email change: `ON`

### 管理者アカウントの作成

1. 「Authentication」→「Users」へ移動
2. 「Add user」→「Create new user」をクリック
3. 管理者のメールアドレスとパスワードを入力
4. 「Create user」をクリック

**重要**: このアカウントが管理画面にログインするための唯一のアカウントです。

## 5. Row Level Security (RLS) の確認

1. 「Table Editor」で各テーブルを選択
2. 右上の「RLS disabled/enabled」が`enabled`になっていることを確認
3. 「Policies」タブでポリシーが設定されていることを確認

### ポリシーの概要
- **公開記事**: 誰でも閲覧可能
- **下書き/非公開**: 認証済みユーザー（管理者）のみ
- **記事の作成/編集/削除**: 認証済みユーザー（管理者）のみ

## 6. 開発サーバーの起動

```bash
bun run dev
```

ブラウザで `http://localhost:3000` を開いて確認。

## 7. トラブルシューティング

### エラー: "Invalid API key"
→ `.env.local`のSupabase URLとAnon Keyが正しいか確認

### エラー: "relation does not exist"
→ SQLマイグレーションが正しく実行されたか確認

### 管理画面にアクセスできない
→ Supabaseで管理者アカウントが作成されているか確認

## 次のステップ

- [x] Supabaseプロジェクト作成
- [x] データベーススキーマ構築
- [x] 環境変数設定
- [x] 認証設定
- [ ] 公開ページの実装
- [ ] 管理画面の実装

---

**参考リンク**:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
