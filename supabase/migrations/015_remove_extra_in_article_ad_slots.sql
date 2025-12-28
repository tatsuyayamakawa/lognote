-- 記事内広告スロットを2つに削減（3〜5を削除）
-- slot_1: 2つ目のH2前、slot_2: 4つ目のH2前

-- 不要なカラムを削除
ALTER TABLE ad_settings
  DROP COLUMN IF EXISTS in_article_pc_slot_3,
  DROP COLUMN IF EXISTS in_article_mobile_slot_3,
  DROP COLUMN IF EXISTS in_article_pc_slot_4,
  DROP COLUMN IF EXISTS in_article_mobile_slot_4,
  DROP COLUMN IF EXISTS in_article_pc_slot_5,
  DROP COLUMN IF EXISTS in_article_mobile_slot_5;

-- コメントを更新
COMMENT ON COLUMN ad_settings.in_article_pc_slot_1 IS 'PC記事内広告（2つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_mobile_slot_1 IS 'モバイル記事内広告（2つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_pc_slot_2 IS 'PC記事内広告（4つ目のH2前）';
COMMENT ON COLUMN ad_settings.in_article_mobile_slot_2 IS 'モバイル記事内広告（4つ目のH2前）';
