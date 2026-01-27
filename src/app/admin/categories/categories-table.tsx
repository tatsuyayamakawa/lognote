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
      <Card className="hidden xl:block pb-0">
        <CardHeader className="pb-3">
          <CardTitle>カテゴリ一覧</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
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
                  <th className="w-28 px-4 py-3 text-left text-sm font-medium">
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

      {/* モバイル・タブレット: カード表示 */}
      <div className="space-y-2 xl:hidden">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden py-0">
            <div className="flex">
              {/* 左側: カラーインジケーター */}
              <div
                className="w-1 shrink-0"
                style={{
                  backgroundColor: category.color || "#e5e7eb",
                }}
              />

              {/* 右側: コンテンツ */}
              <div className="flex-1 px-3 py-2.5">
                {/* ヘッダー: カテゴリ名 + 記事数 */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium line-clamp-1 text-sm">
                      {category.name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground shrink-0">
                    {category.post_count}件
                  </span>
                </div>

                {/* 中段: スラッグ + 説明 */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
                  <span className="font-mono">{category.slug}</span>
                  {category.description && (
                    <>
                      <span className="text-muted-foreground/30">|</span>
                      <span className="line-clamp-1">{category.description}</span>
                    </>
                  )}
                </div>

                {/* フッター: 操作ボタン */}
                <div className="flex items-center gap-0.5 -ml-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    asChild
                  >
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      編集
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(category)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    削除
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

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
