import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CategoriesTable } from "./categories-table"
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
    .order("display_order", { ascending: true })

  // 各カテゴリの記事数を取得
  const categoriesWithCount = await Promise.all(
    (categories || []).map(async (category) => {
      const { count } = await supabase
        .from("post_categories")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)

      return {
        ...category,
        post_count: count || 0,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">カテゴリ管理</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            記事のカテゴリを管理できます
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      <CategoriesTable categories={categoriesWithCount} />
    </div>
  )
}
