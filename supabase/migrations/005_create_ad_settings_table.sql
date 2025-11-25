-- 広告設定テーブルの作成
CREATE TABLE IF NOT EXISTS ad_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- タイトル下広告
  article_top_pc_slot TEXT,
  article_top_mobile_slot TEXT,

  -- 記事内広告（H2の上）
  in_article_pc_slot TEXT,
  in_article_mobile_slot TEXT,

  -- コンテンツ後広告
  article_bottom_pc_slot_1 TEXT,
  article_bottom_pc_slot_2 TEXT,
  article_bottom_mobile_slot TEXT,

  -- サイドバー広告
  sidebar_pc_slot TEXT,
  sidebar_mobile_slot TEXT,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 単一行のみを許可するための制約（ブール型カラムを使用）
ALTER TABLE ad_settings ADD COLUMN singleton BOOLEAN NOT NULL DEFAULT true;
CREATE UNIQUE INDEX ad_settings_single_row_idx ON ad_settings (singleton);

-- RLSを有効化
ALTER TABLE ad_settings ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能
CREATE POLICY "Anyone can read ad settings"
  ON ad_settings
  FOR SELECT
  USING (true);

-- 認証済みユーザーのみ更新可能（管理者用）
CREATE POLICY "Authenticated users can update ad settings"
  ON ad_settings
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 初期レコードを挿入（空の設定）
INSERT INTO ad_settings (id, updated_at)
VALUES (gen_random_uuid(), timezone('utc'::text, now()))
ON CONFLICT DO NOTHING;

-- 更新時にupdated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_ad_settings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_ad_settings_updated_at
  BEFORE UPDATE ON ad_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_ad_settings_updated_at();
