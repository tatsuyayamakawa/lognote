-- 記事下広告のカラム名を変更（article_bottom_pc_slot_1 → article_bottom_pc_slot）
ALTER TABLE ad_settings
RENAME COLUMN article_bottom_pc_slot_1 TO article_bottom_pc_slot;

-- article_bottom_pc_slot_2 カラムを削除（デュアル広告を廃止）
ALTER TABLE ad_settings
DROP COLUMN IF EXISTS article_bottom_pc_slot_2;
