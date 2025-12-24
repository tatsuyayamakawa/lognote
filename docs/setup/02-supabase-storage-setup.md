# Supabase Storage セットアップガイド

このドキュメントでは、ブログのサムネイル画像アップロード機能に必要なSupabase Storageの設定手順を説明します。

## 1. ストレージバケットの作成

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. 左サイドバーから「Storage」を選択
4. 「Create a new bucket」をクリック

### バケット設定

- **Bucket name**: `blog-images`
- **Public bucket**: ✅ チェックを入れる（公開画像として扱うため）
- 「Create bucket」をクリック

## 2. ストレージポリシーの設定

作成したバケットに対して、以下のポリシーを設定します。

### 2.1 公開読み取りポリシー（誰でも画像を閲覧可能）

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );
```

### 2.2 認証ユーザーのアップロードポリシー

```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);
```

### 2.3 認証ユーザーの削除ポリシー

```sql
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);
```

## 3. ポリシー設定手順（GUIから）

1. Supabaseダッシュボードの「Storage」→「Policies」に移動
2. 「blog-images」バケットを選択
3. 各ポリシーについて「New Policy」をクリック

### 公開読み取りポリシー
- Operation: SELECT
- Policy name: Public Access
- Target roles: public
- USING expression: `bucket_id = 'blog-images'`

### アップロードポリシー
- Operation: INSERT
- Policy name: Authenticated users can upload images
- Target roles: authenticated
- WITH CHECK expression: `bucket_id = 'blog-images' AND auth.role() = 'authenticated'`

### 削除ポリシー
- Operation: DELETE
- Policy name: Authenticated users can delete images
- Target roles: authenticated
- USING expression: `bucket_id = 'blog-images' AND auth.role() = 'authenticated'`

## 4. フォルダ構造

バケット内では以下のフォルダ構造を使用します：

```
blog-images/
├── thumbnails/      # 記事サムネイル画像
└── content/         # 記事本文内の画像（将来実装予定）
```

## 5. 画像の制限事項

現在の実装では以下の制限があります：

- **ファイルサイズ**: 最大5MB
- **ファイル形式**: PNG, JPG, GIF, WebP など画像形式全般
- **アップロード権限**: 認証済みユーザーのみ

## 6. 動作確認

1. 管理画面にログイン（`/auth/login`）
2. 記事作成ページ（`/admin/posts/new`）に移動
3. サムネイル画像セクションで画像をアップロード
4. 画像が正常にアップロードされ、プレビューが表示されることを確認
5. 記事を保存し、公開ページで画像が表示されることを確認

## トラブルシューティング

### アップロードエラーが発生する場合

1. **バケットが存在するか確認**
   - Supabaseダッシュボードの「Storage」で`blog-images`バケットが存在することを確認

2. **ポリシーが正しく設定されているか確認**
   - 「Storage」→「Policies」で3つのポリシーが有効になっているか確認

3. **認証状態を確認**
   - ログインしているか確認
   - 必要に応じて再ログイン

4. **ブラウザのコンソールでエラーを確認**
   - F12でデベロッパーツールを開き、エラーメッセージを確認

### 画像が表示されない場合

1. **公開URLが正しいか確認**
   - URLが`https://[project-id].supabase.co/storage/v1/object/public/blog-images/...`の形式になっているか確認

2. **バケットが公開設定になっているか確認**
   - バケット作成時に「Public bucket」にチェックが入っているか確認

3. **ポリシーで公開読み取りが許可されているか確認**
   - SELECT操作のポリシーが正しく設定されているか確認

## 次のステップ

- [ ] 記事本文内に画像を挿入する機能の実装
- [ ] 画像の最適化（リサイズ、圧縮）
- [ ] 使用されていない画像の自動削除機能
