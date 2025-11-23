import Link from "next/link";
import { Profile } from "./profile";
import { AdSense } from "@/components/ads/adsense";
import { getAdsByLocation } from "@/lib/ads";
import type { Category } from "@/types";

interface SidebarProps {
  categories: Category[];
}

export async function Sidebar({ categories }: SidebarProps) {
  const sidebarAd = await getAdsByLocation("sidebar");

  return (
    <aside className="space-y-6">
      {/* プロフィール */}
      <Profile />

      {/* 広告 */}
      {sidebarAd && (
        <div className="rounded-lg border bg-card p-4">
          <AdSense
            adSlot={sidebarAd.ad_slot}
            adFormat="auto"
            fullWidthResponsive={true}
          />
        </div>
      )}

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
