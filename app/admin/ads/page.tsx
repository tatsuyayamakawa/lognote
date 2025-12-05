import { AdLayoutEditor } from "@/components/admin/ad-layout-editor"
import { getAdSettings } from "@/lib/ad-settings"

export default async function AdsPage() {
  const settings = await getAdSettings()

  return <AdLayoutEditor initialSettings={settings} />
}
