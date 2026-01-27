import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CategoriesTable } from "./categories-table"
import { AdminPageHeader } from "../_components/admin-page-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "カテゴリ管理",
}

export default async function CategoriesPage() {
  const supabase = await createClient()

  // カテゴリ一覧を取得
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true })

  // 各カテゴリの記事数を一括で取得
  const { data: postCounts } = await supabase
    .from("post_categories")
    .select("category_id")

  // カテゴリIDごとの記事数をカウント
  const countMap = new Map<string, number>()
  for (const pc of postCounts || []) {
    const current = countMap.get(pc.category_id) || 0
    countMap.set(pc.category_id, current + 1)
  }

  // カテゴリに記事数を付与
  const categoriesWithCount = (categories || []).map((category) => ({
    ...category,
    post_count: countMap.get(category.id) || 0,
  }))

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="カテゴリ管理"
        description="記事のカテゴリを管理できます"
      >
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </AdminPageHeader>

      <CategoriesTable categories={categoriesWithCount} />
    </div>
  )
}
