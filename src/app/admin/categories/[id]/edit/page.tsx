import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CategoryForm } from "../../category-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "カテゴリ編集",
}

interface EditCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single()

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">カテゴリ編集</h1>
        <p className="text-muted-foreground">
          カテゴリ「{category.name}」を編集します
        </p>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}
