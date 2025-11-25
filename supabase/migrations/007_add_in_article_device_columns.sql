-- 記事内広告のデバイス別カラムを追加
-- in_article_pc_slot と in_article_mobile_slot を追加

-- 既存の in_article_slot カラムがある場合は削除
ALTER TABLE ad_settings DROP COLUMN IF EXISTS in_article_slot;

-- 新しいカラムを追加
ALTER TABLE ad_settings ADD COLUMN IF NOT EXISTS in_article_pc_slot TEXT;
ALTER TABLE ad_settings ADD COLUMN IF NOT EXISTS in_article_mobile_slot TEXT;
