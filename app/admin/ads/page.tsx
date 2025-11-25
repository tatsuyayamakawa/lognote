import { AdsTable } from "./ads-table"
import { getAllAds } from "@/lib/ads"

export default async function AdsPage() {
  const ads = await getAllAds()

  return (
    <div className="space-y-8">
      {/* 広告テーブル（ヘッダー含む） */}
      <AdsTable initialAds={ads} />
    </div>
  )
}
