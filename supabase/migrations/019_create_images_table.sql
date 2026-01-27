-- 画像管理テーブル
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL UNIQUE,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  mimetype TEXT,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_images_post_id ON images(post_id);
CREATE INDEX idx_images_created_at ON images(created_at DESC);
CREATE INDEX idx_images_file_name ON images(file_name);

-- updated_atトリガー
CREATE TRIGGER set_images_updated_at
  BEFORE UPDATE ON images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS有効化
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- 公開読み取りポリシー（誰でも画像情報を参照可能）
CREATE POLICY "images_select_policy" ON images
  FOR SELECT
  USING (true);

-- 認証済みユーザーの操作ポリシー
CREATE POLICY "images_insert_policy" ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "images_update_policy" ON images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "images_delete_policy" ON images
  FOR DELETE
  TO authenticated
  USING (true);

-- コメント
COMMENT ON TABLE images IS '画像管理テーブル';
COMMENT ON COLUMN images.file_name IS 'ファイル名（一意）';
COMMENT ON COLUMN images.storage_path IS 'Storageのパス（例: content/xxx.jpg）';
COMMENT ON COLUMN images.url IS '公開URL';
COMMENT ON COLUMN images.size IS 'ファイルサイズ（バイト）';
COMMENT ON COLUMN images.mimetype IS 'MIMEタイプ';
COMMENT ON COLUMN images.post_id IS '紐付け記事ID（任意）';
