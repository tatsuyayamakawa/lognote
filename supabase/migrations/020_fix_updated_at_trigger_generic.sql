-- ===========================
-- Fix updated_at trigger for generic tables
-- ===========================

-- 汎用的な updated_at トリガー関数（posts以外のテーブル用）
CREATE OR REPLACE FUNCTION update_updated_at_column_generic()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- imagesテーブルのトリガーを汎用版に変更
DROP TRIGGER IF EXISTS set_images_updated_at ON images;
CREATE TRIGGER set_images_updated_at
  BEFORE UPDATE ON images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column_generic();

-- google_adsense_tokensテーブルのトリガーを汎用版に変更
DROP TRIGGER IF EXISTS update_google_adsense_tokens_updated_at ON google_adsense_tokens;
CREATE TRIGGER update_google_adsense_tokens_updated_at
  BEFORE UPDATE ON google_adsense_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column_generic();
