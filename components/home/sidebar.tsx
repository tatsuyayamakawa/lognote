import Link from "next/link";
import { Profile } from "./profile";
import { ResponsiveAd } from "@/components/ads/responsive-ad";
import { getAdSettings } from "@/lib/ad-settings";
import type { Category } from "@/types";

interface SidebarProps {
  categories: Category[];
}

export async function Sidebar({ categories }: SidebarProps) {
  const adSettings = await getAdSettings();

  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-6">
      {/* サイドバー広告 */}
      {(adSettings?.sidebar_pc_slot || adSettings?.sidebar_mobile_slot) && (
        <ResponsiveAd
          pcSlot={adSettings?.sidebar_pc_slot}
          mobileSlot={adSettings?.sidebar_mobile_slot}
          pcConfig={{
            width: "300px",
            height: "600px",
            adFormat: "vertical",
            fullWidthResponsive: false,
          }}
          mobileConfig={{
            width: "300px",
            height: "250px",
            adFormat: "rectangle",
            fullWidthResponsive: false,
          }}
        />
      )}

      {/* プロフィール */}
      <Profile />

      {/* カテゴリ一覧 */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-bold">カテゴリ</h3>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/60"
              >
                <span className="font-medium">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
