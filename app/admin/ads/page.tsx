import { AdSettingsForm } from "./ad-settings-form"
import { getAdSettings } from "@/lib/ad-settings"

export default async function AdsPage() {
  const settings = await getAdSettings()

  return <AdSettingsForm initialSettings={settings} />
}
