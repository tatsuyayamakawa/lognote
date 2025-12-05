-- OG画像のキャッシュURLを保存するカラムを追加
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- インデックスを追加（高速な検索のため）
CREATE INDEX IF NOT EXISTS idx_posts_og_image_url ON posts(og_image_url);

-- コメントを追加
COMMENT ON COLUMN posts.og_image_url IS '生成されたOG画像のキャッシュURL（Supabase Storageに保存）';
