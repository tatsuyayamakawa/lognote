-- 古いadsテーブルを削除（ad_settingsに移行済み）
DROP TABLE IF EXISTS ads CASCADE;

-- 関連する古いファイルも削除対象
-- app/api/ads/[id]/route.ts
-- lib/ads.ts (getAdsByLocation, getAllAds, createAd, updateAd, deleteAd)
-- app/admin/ads/ads-table.tsx (旧テーブル管理UI)

-- これらのファイルは手動で削除またはアーカイブしてください
