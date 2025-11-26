"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Category } from "@/types"

interface CategoryFormProps {
  category?: Category
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(category?.name || "")
  const [slug, setSlug] = useState(category?.slug || "")
  const [description, setDescription] = useState(category?.description || "")
  const [color, setColor] = useState(category?.color || "#3b82f6")
  const [displayOrder, setDisplayOrder] = useState(
    category?.order?.toString() || "0"
  )

  // 名前からスラッグを自動生成
  const handleNameChange = (value: string) => {
    setName(value)
    if (!category) {
      // 新規作成時のみ自動生成
      const autoSlug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .trim()
      setSlug(autoSlug)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const categoryData = {
        name,
        slug,
        description: description || null,
        color,
        order: parseInt(displayOrder) || 0,
      }

      if (category) {
        // 更新
        const { error: updateError } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", category.id)

        if (updateError) throw updateError
      } else {
        // 新規作成
        const { error: insertError } = await supabase
          .from("categories")
          .insert([categoryData])

        if (insertError) throw insertError
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>カテゴリの基本情報を入力してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">カテゴリ名 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">スラッグ *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              disabled={loading}
              placeholder="url-friendly-slug"
            />
            <p className="text-xs text-muted-foreground">
              URL: /category/{slug || "url-friendly-slug"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="カテゴリの説明（任意）"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">カラー</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={loading}
                className="h-10 w-20"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={loading}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              カテゴリの表示色を設定します
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">表示順</Label>
            <Input
              id="displayOrder"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              disabled={loading}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              数字が小さいほど上に表示されます
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : category ? "更新" : "作成"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          キャンセル
        </Button>
      </div>
    </form>
  )
}
