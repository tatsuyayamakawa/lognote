import { CategoryForm } from "../category-form"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">カテゴリ新規作成</h1>
        <p className="text-muted-foreground">
          新しいカテゴリを作成します
        </p>
      </div>

      <CategoryForm />
    </div>
  )
}
