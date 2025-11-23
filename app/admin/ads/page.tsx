import { Suspense } from "react"
import { AdsTable } from "./ads-table"
import { getAllAds } from "@/lib/ads"

export default async function AdsPage() {
  const ads = await getAllAds()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">広告管理</h1>
        <p className="mt-2 text-muted-foreground">
          Google AdSenseの広告スロットを管理します
        </p>
      </div>

      <Suspense fallback={<div>読み込み中...</div>}>
        <AdsTable initialAds={ads} />
      </Suspense>
    </div>
  )
}
