# OG画像最適化の実装

## 概要

Vercelの Fluid Active CPU 超過問題を解決するため、OG画像のオンデマンドISR（Incremental Static Regeneration）を実装しました。

## 問題点

- Edge Function (`/api/og`) が記事一覧の各サムネイルで呼び出され、CPU使用量が増大
- Next.js の Image コンポーネントで `unoptimized: true` のため、キャッシュが効かない
- 毎回動的にOG画像を生成していた

## 解決策

### アーキテクチャ

**オンデマンドISR + 手動再生成**の組み合わせ：

1. **初回**: 記事作成時は `/api/og` で動的生成（Edge Function実行）
2. **キャッシュ**: 管理画面の「OG画像を生成」ボタンで、画像をSupabase Storageに保存
3. **以降**: キャッシュされた画像を優先的に使用（Edge Function実行なし）
4. **更新**: タイトル変更時など、必要に応じて手動で再生成

### データベーススキーマ

```sql
-- postsテーブルに新しいカラムを追加
ALTER TABLE posts ADD COLUMN og_image_url TEXT;
```

### 画像の優先順位

コンポーネントでは以下の優先順位で画像を決定：

1. `thumbnail_url` - カスタムアップロードされたサムネイル
2. `og_image_url` - キャッシュされたOG画像（Supabase Storage）
3. `/api/og?title=...` - 動的生成（フォールバック）

## 実装ファイル

### 1. データベースマイグレーション

- `migrations/add_og_image_url.sql` - og_image_urlカラムを追加

### 2. 型定義

- `types/database.types.ts` - Postテーブルの型定義を更新

### 3. Server Actions

- `app/actions/generate-og-image.ts`
  - `generateOgImage()` - OG画像を生成してSupabaseに保存
  - `deleteOgImage()` - キャッシュされたOG画像を削除

### 4. UI コンポーネント

- `app/admin/posts/post-form.tsx` - 管理画面にOG画像生成ボタンを追加
- `app/(public)/_components/article-card.tsx` - og_image_urlを優先的に使用
- `app/(public)/[slug]/page.tsx` - 個別記事ページでog_image_urlを使用
- `components/post/related-posts.tsx` - 関連記事でog_image_urlを使用

## 使い方

### 管理画面での操作

1. 記事を作成・保存
2. 「サムネイル画像」カードの「OG画像キャッシュ」セクションへ
3. 「OG画像を生成」ボタンをクリック
4. 生成された画像がSupabase Storageに保存される

### タイトル変更時

1. 記事のタイトルを変更
2. 保存
3. 「再生成」ボタンをクリックして新しいOG画像を生成

### OG画像の削除

「削除」ボタンをクリックすると：
- Supabase Storageから画像ファイルを削除
- データベースの `og_image_url` をクリア
- 次回は動的生成にフォールバック

## 期待される効果

### CPU使用量の削減

- ✅ Edge Function実行回数が大幅に減少（記事一覧での自動実行なし）
- ✅ 手動生成のみのため、必要最小限のリソース使用
- ✅ Supabase Storageからの静的配信（高速・低コスト）

### パフォーマンス向上

- ✅ 画像読み込みが高速化（Edge Function処理不要）
- ✅ CDNキャッシュの恩恵を受けられる
- ✅ ページロード時間の短縮

### 柔軟性

- ✅ タイトル変更時も手動で再生成可能
- ✅ 不要なキャッシュは削除可能
- ✅ カスタムサムネイルとの共存

## Supabaseの設定

### Storageバケット

既存の `blog-images` バケットを使用：

```
blog-images/
  ├─ thumbnails/     (カスタムサムネイル)
  └─ og-images/      (生成されたOG画像)
```

### 注意事項

- バケットのポリシーで公開アクセスが許可されていることを確認
- キャッシュコントロールは1年（31536000秒）に設定

## 今後の改善案

### 自動生成の検討

記事保存時に自動的にOG画像を生成する場合：

```typescript
// post-form.tsxのhandleSubmit内
if (!post) {
  // 新規作成時は自動生成
  await generateOgImage(postId, title);
}
```

### バッチ処理

既存の全記事に対してOG画像を一括生成するスクリプト：

```typescript
// scripts/generate-all-og-images.ts
import { getPublishedPosts } from '@/lib/posts'
import { generateOgImage } from '@/app/actions/generate-og-image'

const posts = await getPublishedPosts()
for (const post of posts) {
  if (!post.og_image_url) {
    await generateOgImage(post.id, post.title)
  }
}
```

## トラブルシューティング

### OG画像が生成されない

1. Supabase接続を確認
2. `blog-images` バケットの存在を確認
3. ブラウザのコンソールでエラーメッセージを確認

### 古い画像が表示される

1. ブラウザのキャッシュをクリア
2. 「再生成」ボタンで画像を更新
3. Vercelのキャッシュをクリア（必要に応じて）

## まとめ

この実装により、Vercel の CPU 使用量を大幅に削減しつつ、タイトルを含んだカスタムOG画像を維持できます。手動での再生成により、完全なコントロールと柔軟性を保ちながら、リソース使用を最小限に抑えることができます。
