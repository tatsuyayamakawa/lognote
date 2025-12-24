# updated_atトリガーの修正手順

## 問題

閲覧数（view_count）が更新されると、updated_atも一緒に更新されてしまう不具合があります。

## 原因

データベーストリガー関数 `update_updated_at_column()` に以下の問題がありました：

1. `og_image_url` カラムが追加されたが、トリガーでチェックされていない
2. そのため、view_countのみの更新でも「他のカラムが変更された」と判断される
3. 結果として updated_at が更新されてしまう

## 解決策

マイグレーションファイル `010_fix_updated_at_trigger_complete.sql` でトリガー関数を修正しました。

### 修正内容

```sql
-- og_image_url のチェックを追加
(OLD.og_image_url IS NOT DISTINCT FROM NEW.og_image_url)
```

すべてのカラム（view_count以外）が変更されていない場合のみ、updated_atの更新をスキップします。

## 適用方法

### オプション1: Supabase Dashboard（推奨）

1. **Supabase Dashboard** にログイン
2. **SQL Editor** を開く
3. `supabase/migrations/010_fix_updated_at_trigger_complete.sql` の内容をコピー
4. SQL Editorに貼り付けて実行

### オプション2: Supabase CLI

```bash
# Supabase CLIでマイグレーションを適用
npx supabase db push
```

または

```bash
# 特定のマイグレーションファイルを実行
npx supabase db push --include-all
```

### オプション3: 直接SQL実行

Supabaseの管理画面から以下のSQLを直接実行：

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF (OLD.view_count IS DISTINCT FROM NEW.view_count) AND
     (OLD.title IS NOT DISTINCT FROM NEW.title) AND
     (OLD.slug IS NOT DISTINCT FROM NEW.slug) AND
     (OLD.content IS NOT DISTINCT FROM NEW.content) AND
     (OLD.excerpt IS NOT DISTINCT FROM NEW.excerpt) AND
     (OLD.thumbnail_url IS NOT DISTINCT FROM NEW.thumbnail_url) AND
     (OLD.thumbnail_type IS NOT DISTINCT FROM NEW.thumbnail_type) AND
     (OLD.status IS NOT DISTINCT FROM NEW.status) AND
     (OLD.published_at IS NOT DISTINCT FROM NEW.published_at) AND
     (OLD.author_id IS NOT DISTINCT FROM NEW.author_id) AND
     (OLD.meta_description IS NOT DISTINCT FROM NEW.meta_description) AND
     (OLD.is_featured IS NOT DISTINCT FROM NEW.is_featured) AND
     (OLD.og_image_url IS NOT DISTINCT FROM NEW.og_image_url) THEN
    RETURN NEW;
  ELSE
    NEW.updated_at = NOW();
    RETURN NEW;
  END IF;
END;
$$;
```

## 確認方法

### 1. トリガーが存在することを確認

```sql
SELECT tgname, tgtype, tgenabled
FROM pg_trigger
WHERE tgrelid = 'posts'::regclass;
```

### 2. 関数の内容を確認

```sql
SELECT prosrc
FROM pg_proc
WHERE proname = 'update_updated_at_column';
```

### 3. 動作テスト

```sql
-- テスト用記事のupdated_atを記録
SELECT id, title, view_count, updated_at
FROM posts
WHERE id = 'YOUR_POST_ID';

-- view_countのみを更新
UPDATE posts
SET view_count = view_count + 1
WHERE id = 'YOUR_POST_ID';

-- updated_atが変更されていないことを確認
SELECT id, title, view_count, updated_at
FROM posts
WHERE id = 'YOUR_POST_ID';
```

**期待される結果**:
- view_count が +1 される
- updated_at は変更されない

### 4. タイトル変更時のテスト

```sql
-- タイトルを変更
UPDATE posts
SET title = 'Test Title Update'
WHERE id = 'YOUR_POST_ID';

-- updated_atが更新されることを確認
SELECT id, title, view_count, updated_at
FROM posts
WHERE id = 'YOUR_POST_ID';
```

**期待される結果**:
- title が変更される
- updated_at が現在時刻に更新される

## トラブルシューティング

### マイグレーションが適用されない

```bash
# マイグレーション履歴を確認
npx supabase migration list

# マイグレーションをリセット（注意：開発環境のみ）
npx supabase db reset
```

### トリガーが動作しない

```sql
-- トリガーが有効か確認
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgrelid = 'posts'::regclass;

-- tgenabled が 'O' (有効) であることを確認
-- 'D' の場合は無効化されている
```

### 権限エラー

```sql
-- 関数の所有者とSECURITY DEFINERを確認
SELECT proname, proowner, prosecdef
FROM pg_proc
WHERE proname = 'update_updated_at_column';
```

## 今後の注意点

postsテーブルに新しいカラムを追加する場合：

1. **マイグレーションファイルでカラムを追加**
2. **トリガー関数も同時に更新**して新しいカラムをチェックに含める

例：
```sql
-- 新しいカラムを追加
ALTER TABLE posts ADD COLUMN new_field TEXT;

-- トリガー関数を更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
...
(OLD.og_image_url IS NOT DISTINCT FROM NEW.og_image_url) AND
(OLD.new_field IS NOT DISTINCT FROM NEW.new_field) THEN  -- 追加
...
```

これにより、view_count以外の変更を正確に検出できます。

## まとめ

この修正により：

✅ view_countのみの更新時はupdated_atが変更されない
✅ 他のカラムの変更時はupdated_atが正しく更新される
✅ すべてのカラムが適切にチェックされる

記事管理画面で閲覧数が更新されても、更新日が変わらなくなります！
