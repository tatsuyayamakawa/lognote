import { AdSettingsForm } from "./ad-settings-form"
import { getAdSettings } from "@/lib/ad-settings"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3 } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "広告管理",
}

export default async function AdsPage() {
  const settings = await getAdSettings()

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold sm:text-3xl">広告管理</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            AdSense広告ユニットの設定
          </p>
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/admin/ads/reports">
            <BarChart3 className="mr-2 h-4 w-4" />
            AdSenseレポート
          </Link>
        </Button>
      </div>

      {/* 広告設定フォーム */}
      <AdSettingsForm initialSettings={settings} />
    </div>
  )
}
