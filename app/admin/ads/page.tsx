import { AdLayoutEditor } from "@/components/admin/ad-layout-editor"
import { getAdSettings } from "@/lib/ad-settings"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "広告管理",
}

export default async function AdsPage() {
  const settings = await getAdSettings()

  return <AdLayoutEditor initialSettings={settings} />
}
