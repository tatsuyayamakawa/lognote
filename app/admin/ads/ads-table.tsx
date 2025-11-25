"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Ad, AdFormData, AdLocation } from "@/types/ad"

interface AdsTableProps {
  initialAds: Ad[]
}

const locationLabels: Record<AdLocation, string> = {
  sidebar: "サイドバー",
  article_top: "記事上部（タイトル下）",
  article_bottom: "記事下部（コンテンツ後）",
}

export function AdsTable({ initialAds }: AdsTableProps) {
  const router = useRouter()
  const ads = initialAds
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [deletingAd, setDeletingAd] = useState<Ad | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<AdFormData>({
    name: "",
    ad_slot: "",
    location: "sidebar",
    is_active: true,
  })

  const handleCreate = () => {
    setEditingAd(null)
    setFormData({
      name: "",
      ad_slot: "",
      location: "sidebar",
      is_active: true,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad)
    setFormData({
      name: ad.name,
      ad_slot: ad.ad_slot,
      location: ad.location,
      is_active: ad.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (ad: Ad) => {
    setDeletingAd(ad)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingAd
        ? `/api/ads/${editingAd.id}`
        : "/api/ads"

      const method = editingAd ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error:", errorData)
        throw new Error(errorData.error || "Failed to save ad")
      }

      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving ad:", error)
      alert(`広告の保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deletingAd) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/ads/${deletingAd.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete ad")
      }

      setIsDeleteDialogOpen(false)
      setDeletingAd(null)
      router.refresh()
    } catch (error) {
      console.error("Error deleting ad:", error)
      alert("広告の削除に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (ads.length === 0) {
    return (
      <>
        {/* ページヘッダー */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">広告管理</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Google AdSenseの広告スロットを管理します（0件）
            </p>
          </div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>広告がありません</CardTitle>
            <CardDescription>
              新規作成ボタンから最初の広告を登録しましょう
            </CardDescription>
          </CardHeader>
        </Card>
        {renderDialogs()}
      </>
    )
  }

  return (
    <>
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">広告管理</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Google AdSenseの広告スロットを管理します（{ads.length}件）
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>

      {/* デスクトップ: テーブル表示 */}
      <Card className="hidden md:block pb-0">
        <CardHeader className="pb-3">
          <CardTitle>広告一覧</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">名前</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">広告スロットID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">表示位置</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">状態</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ads.map((ad) => (
                  <tr key={ad.id} className="transition-colors hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{ad.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-sm">{ad.ad_slot}</code>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{locationLabels[ad.location]}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          ad.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ad.is_active ? "有効" : "無効"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(ad)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(ad)}
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

      {/* モバイル: カード表示 */}
      <div className="space-y-4 md:hidden">
        {ads.map((ad) => (
          <Card key={ad.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base">{ad.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <code className="text-xs">{ad.ad_slot}</code>
                  </CardDescription>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    ad.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ad.is_active ? "有効" : "無効"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                表示位置: {locationLabels[ad.location]}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(ad)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  編集
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(ad)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  削除
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {renderDialogs()}
    </>
  )

  function renderDialogs() {
    return (
      <>

      {/* 作成・編集ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAd ? "広告を編集" : "広告を新規作成"}
            </DialogTitle>
            <DialogDescription>
              Google AdSenseの広告スロット情報を入力してください
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="例: サイドバー広告"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad_slot">広告スロットID</Label>
              <Input
                id="ad_slot"
                value={formData.ad_slot}
                onChange={(e) =>
                  setFormData({ ...formData, ad_slot: e.target.value })
                }
                placeholder="例: 1234567890"
                required
              />
              <p className="text-xs text-muted-foreground">
                Google AdSenseの管理画面で確認できます
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">表示位置</Label>
              <Select
                value={formData.location}
                onValueChange={(value: AdLocation) =>
                  setFormData({ ...formData, location: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sidebar">サイドバー</SelectItem>
                  <SelectItem value="article_top">記事上部</SelectItem>
                  <SelectItem value="article_bottom">記事下部</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">有効にする</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "保存中..." : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>広告を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。広告「{deletingAd?.name}
              」を完全に削除します。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "削除中..." : "削除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
    )
  }
}
