"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2 } from "lucide-react"
import type { Category } from "@/types"

interface CategoryWithCount extends Category {
  post_count: number
}

interface CategoriesTableProps {
  categories: CategoryWithCount[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<CategoryWithCount | null>(
    null
  )
  const [deleting, setDeleting] = useState(false)

  const handleDeleteClick = (category: CategoryWithCount) => {
    setDeleteTarget(category)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return

    // 記事が紐づいている場合は削除不可
    if (deleteTarget.post_count > 0) {
      alert("このカテゴリには記事が紐づいているため削除できません")
      setDeleteDialogOpen(false)
      return
    }

    setDeleting(true)
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", deleteTarget.id)

      if (error) throw error

      router.refresh()
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    } catch (err) {
      console.error("Delete error:", err)
      alert("削除に失敗しました")
    } finally {
      setDeleting(false)
    }
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>カテゴリがありません</CardTitle>
          <CardDescription>
            新規作成ボタンから最初のカテゴリを作成しましょう
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    カテゴリ名
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    スラッグ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    説明
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    記事数
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    表示順
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex h-6 w-6 rounded"
                          style={{
                            backgroundColor: category.color || "#e5e7eb",
                          }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {category.slug}
                    </td>
                    <td className="px-4 py-3">
                      <p className="line-clamp-2 max-w-md text-sm text-muted-foreground">
                        {category.description || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {category.post_count}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {category.order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/categories/${category.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>カテゴリを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。カテゴリ「{deleteTarget?.name}
              」を完全に削除します。
              {deleteTarget && deleteTarget.post_count > 0 && (
                <span className="mt-2 block text-destructive">
                  このカテゴリには{deleteTarget.post_count}
                  件の記事が紐づいているため削除できません。
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting || (deleteTarget?.post_count || 0) > 0}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "削除中..." : "削除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
