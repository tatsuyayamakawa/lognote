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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AdSettings, AdSettingsFormData } from "@/types/ad"
import { Save } from "lucide-react"

interface AdSettingsFormProps {
  initialSettings: AdSettings | null
}

export function AdSettingsForm({ initialSettings }: AdSettingsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<AdSettingsFormData>({
    article_top_pc_slot: initialSettings?.article_top_pc_slot || "",
    article_top_mobile_slot: initialSettings?.article_top_mobile_slot || "",
    in_article_pc_slot: initialSettings?.in_article_pc_slot || "",
    in_article_mobile_slot: initialSettings?.in_article_mobile_slot || "",
    article_bottom_pc_slot_1: initialSettings?.article_bottom_pc_slot_1 || "",
    article_bottom_pc_slot_2: initialSettings?.article_bottom_pc_slot_2 || "",
    article_bottom_mobile_slot: initialSettings?.article_bottom_mobile_slot || "",
    sidebar_pc_slot: initialSettings?.sidebar_pc_slot || "",
    sidebar_mobile_slot: initialSettings?.sidebar_mobile_slot || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/ad-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save ad settings")
      }

      router.refresh()
      alert("広告設定を保存しました")
    } catch (error) {
      console.error("Error saving ad settings:", error)
      alert(`広告設定の保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">広告設定</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            各広告ユニットのスロットIDを設定します
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* タイトル下広告 */}
        <Card>
          <CardHeader>
            <CardTitle>タイトル下広告（ファーストビュー）</CardTitle>
            <CardDescription>
              記事タイトル直下に表示される広告
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="article_top_pc_slot">
                  PC用 <span className="text-xs text-muted-foreground">（ディスプレイ広告 - 横長バナー）</span>
                </Label>
                <Input
                  id="article_top_pc_slot"
                  placeholder="1234567890"
                  value={formData.article_top_pc_slot}
                  onChange={(e) =>
                    setFormData({ ...formData, article_top_pc_slot: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  推奨サイズ: 728×90（horizontal）
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="article_top_mobile_slot">
                  スマホ用 <span className="text-xs text-muted-foreground">（ディスプレイ広告 - スクエア）</span>
                </Label>
                <Input
                  id="article_top_mobile_slot"
                  placeholder="1234567890"
                  value={formData.article_top_mobile_slot}
                  onChange={(e) =>
                    setFormData({ ...formData, article_top_mobile_slot: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  推奨サイズ: 300×250（rectangle）
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 記事内広告 */}
        <Card>
          <CardHeader>
            <CardTitle>記事内広告（2つ目のH2上）</CardTitle>
            <CardDescription>
              H2が2つ以上ある記事の2つ目のH2の前に自動挿入される広告
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="in_article_pc_slot">
                  PC用 <span className="text-xs text-muted-foreground">（記事内広告）</span>
                </Label>
                <Input
                  id="in_article_pc_slot"
                  placeholder="1234567890"
                  value={formData.in_article_pc_slot}
                  onChange={(e) =>
                    setFormData({ ...formData, in_article_pc_slot: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  AdSense管理画面で「記事内広告」を作成してください
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="in_article_mobile_slot">
                  スマホ用 <span className="text-xs text-muted-foreground">（記事内広告）</span>
                </Label>
                <Input
                  id="in_article_mobile_slot"
                  placeholder="1234567890"
                  value={formData.in_article_mobile_slot}
                  onChange={(e) =>
                    setFormData({ ...formData, in_article_mobile_slot: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  AdSense管理画面で「記事内広告」を作成してください
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* コンテンツ後広告 */}
        <Card>
          <CardHeader>
            <CardTitle>コンテンツ後広告</CardTitle>
            <CardDescription>
              記事本文の直後、シェアボタンの上に表示される広告
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>
                PC用 <span className="text-xs text-muted-foreground">（ディスプレイ広告 - スクエア × 2個横並び）</span>
              </Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Input
                    placeholder="1つ目: 1234567890"
                    value={formData.article_bottom_pc_slot_1}
                    onChange={(e) =>
                      setFormData({ ...formData, article_bottom_pc_slot_1: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    推奨サイズ: 300×250（rectangle）
                  </p>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="2つ目: 1234567890"
                    value={formData.article_bottom_pc_slot_2}
                    onChange={(e) =>
                      setFormData({ ...formData, article_bottom_pc_slot_2: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    推奨サイズ: 300×250（rectangle）
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="article_bottom_mobile_slot">
                スマホ用 <span className="text-xs text-muted-foreground">（ディスプレイ広告 - スクエア）</span>
              </Label>
              <Input
                id="article_bottom_mobile_slot"
                placeholder="1234567890"
                value={formData.article_bottom_mobile_slot}
                onChange={(e) =>
                  setFormData({ ...formData, article_bottom_mobile_slot: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                推奨サイズ: 300×250（rectangle）
              </p>
            </div>
          </CardContent>
        </Card>

        {/* サイドバー広告 */}
        <Card>
          <CardHeader>
            <CardTitle>サイドバー広告</CardTitle>
            <CardDescription>
              サイドバー（TOPページ・カテゴリページ）に表示される広告
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sidebar_pc_slot">
                  PC用 <span className="text-xs text-muted-foreground">（ディスプレイ広告 - 縦長）</span>
                </Label>
                <Input
                  id="sidebar_pc_slot"
                  placeholder="1234567890"
                  value={formData.sidebar_pc_slot}
                  onChange={(e) =>
                    setFormData({ ...formData, sidebar_pc_slot: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  推奨サイズ: 300×600（vertical）
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sidebar_mobile_slot">
                  スマホ用 <span className="text-xs text-muted-foreground">（ディスプレイ広告 - スクエア）</span>
                </Label>
                <Input
                  id="sidebar_mobile_slot"
                  placeholder="1234567890"
                  value={formData.sidebar_mobile_slot}
                  onChange={(e) =>
                    setFormData({ ...formData, sidebar_mobile_slot: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  推奨サイズ: 300×250（rectangle）
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 保存ボタン */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "保存中..." : "設定を保存"}
          </Button>
        </div>
      </form>
    </div>
  )
}
