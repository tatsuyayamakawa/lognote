import { AdSettingsForm } from "./ad-settings-form"
import { getAdSettings } from "@/lib/ad-settings"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3 } from "lucide-react"
import { AdminPageHeader } from "../_components/admin-page-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "広告管理",
}

export default async function AdsPage() {
  const settings = await getAdSettings()

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <AdminPageHeader
        title="広告管理"
        description="AdSense広告ユニットの設定"
      >
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/admin/ads/reports">
            <BarChart3 className="mr-2 h-4 w-4" />
            AdSenseレポート
          </Link>
        </Button>
      </AdminPageHeader>

      {/* 広告設定フォーム */}
      <AdSettingsForm initialSettings={settings} />
    </div>
  )
}
