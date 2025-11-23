import Link from "next/link";
import { Profile } from "./profile";
import type { Category } from "@/types";

interface SidebarProps {
  categories: Category[];
}

export function Sidebar({ categories }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* プロフィール */}
      <Profile />

      {/* カテゴリ一覧 */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="mb-4 text-lg font-bold">カテゴリ</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                style={{
                  borderLeft: `3px solid ${category.color || '#e5e7eb'}`,
                }}
              >
                <span>{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
