"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  article_top: "記事上部",
  article_bottom: "記事下部",
}

export function AdsTable({ initialAds }: AdsTableProps) {
  const router = useRouter()
  const [ads, setAds] = useState<Ad[]>(initialAds)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null)
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

  const handleDelete = (id: string) => {
    setDeletingAdId(id)
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
    if (!deletingAdId) return
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/ads/${deletingAdId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete ad")
      }

      setIsDeleteDialogOpen(false)
      setDeletingAdId(null)
      router.refresh()
    } catch (error) {
      console.error("Error deleting ad:", error)
      alert("広告の削除に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {ads.length}件の広告
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>広告スロットID</TableHead>
              <TableHead>表示位置</TableHead>
              <TableHead>状態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  広告が登録されていません
                </TableCell>
              </TableRow>
            ) : (
              ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.name}</TableCell>
                  <TableCell className="font-mono text-sm">{ad.ad_slot}</TableCell>
                  <TableCell>{locationLabels[ad.location]}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        ad.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {ad.is_active ? "有効" : "無効"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(ad)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(ad.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>広告を削除</DialogTitle>
            <DialogDescription>
              この広告を削除してもよろしいですか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "削除中..." : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
