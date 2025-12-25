-- 記事内広告スロットを5つに拡張
-- 既存の in_article_pc_slot と in_article_mobile_slot を _1 にリネーム
-- _2〜_5 を追加

-- 既存のカラムをリネーム
ALTER TABLE ad_settings
  RENAME COLUMN in_article_pc_slot TO in_article_pc_slot_1;

ALTER TABLE ad_settings
  RENAME COLUMN in_article_mobile_slot TO in_article_mobile_slot_1;

-- 新しいカラムを追加（位置2〜5）
ALTER TABLE ad_settings
  ADD COLUMN in_article_pc_slot_2 TEXT,
  ADD COLUMN in_article_mobile_slot_2 TEXT,
  ADD COLUMN in_article_pc_slot_3 TEXT,
  ADD COLUMN in_article_mobile_slot_3 TEXT,
  ADD COLUMN in_article_pc_slot_4 TEXT,
  ADD COLUMN in_article_mobile_slot_4 TEXT,
  ADD COLUMN in_article_pc_slot_5 TEXT,
  ADD COLUMN in_article_mobile_slot_5 TEXT;

-- コメントを追加
COMMENT ON COLUMN ad_settings.in_article_pc_slot_1 IS 'PC記事内広告（2つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_mobile_slot_1 IS 'モバイル記事内広告（2つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_pc_slot_2 IS 'PC記事内広告（3つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_mobile_slot_2 IS 'モバイル記事内広告（3つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_pc_slot_3 IS 'PC記事内広告（4つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_mobile_slot_3 IS 'モバイル記事内広告（4つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_pc_slot_4 IS 'PC記事内広告（5つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_mobile_slot_4 IS 'モバイル記事内広告（5つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_pc_slot_5 IS 'PC記事内広告（6つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_mobile_slot_5 IS 'モバイル記事内広告（6つ目のH2前）';
