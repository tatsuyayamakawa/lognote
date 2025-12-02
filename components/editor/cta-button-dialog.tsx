"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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

interface CtaButtonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (options: { href: string; text: string; variant: 'primary' | 'secondary' | 'outline' }) => void
  initialData?: {
    href: string
    text: string
    variant: 'primary' | 'secondary' | 'outline'
  }
}

export function CtaButtonDialog({
  open,
  onOpenChange,
  onSelect,
  initialData,
}: CtaButtonDialogProps) {
  const [href, setHref] = useState("")
  const [text, setText] = useState("")
  const [variant, setVariant] = useState<'primary' | 'secondary' | 'outline'>('primary')

  // 初期データがある場合は編集モード
  const isEditMode = !!initialData

  // ダイアログが開いた時に初期データをセット
  useEffect(() => {
    if (open && initialData) {
      setHref(initialData.href || "")
      setText(initialData.text || "")
      setVariant(initialData.variant || 'primary')
    } else if (!open) {
      setHref("")
      setText("")
      setVariant('primary')
    }
  }, [open, initialData])

  const handleSubmit = () => {
    if (!href || !text) return

    onSelect({
      href,
      text,
      variant,
    })

    handleClose()
  }

  const handleClose = () => {
    setHref("")
    setText("")
    setVariant('primary')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "CTAボタンを編集" : "CTAボタンを挿入"}</DialogTitle>
          <DialogDescription>
            クリックを促進するボタンリンクを{isEditMode ? "編集" : "挿入"}します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="text">ボタンテキスト</Label>
            <Input
              id="text"
              placeholder="今すぐ無料で試す"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="href">リンク先URL</Label>
            <Input
              id="href"
              type="url"
              placeholder="https://example.com"
              value={href}
              onChange={(e) => setHref(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variant">スタイル</Label>
            <Select value={variant} onValueChange={(value) => setVariant(value as typeof variant)}>
              <SelectTrigger id="variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">プライマリ（塗りつぶし）</SelectItem>
                <SelectItem value="secondary">セカンダリ（グレー）</SelectItem>
                <SelectItem value="outline">アウトライン（枠線）</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* プレビュー */}
          {text && (
            <div className="space-y-2">
              <Label>プレビュー</Label>
              <div className="flex justify-center rounded-lg border bg-muted/50 p-8">
                <button
                  type="button"
                  className={`inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold transition-colors shadow-lg ${
                    variant === 'primary'
                      ? 'bg-primary text-primary-foreground'
                      : variant === 'secondary'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'border-2 border-primary text-primary'
                  }`}
                >
                  {text}
                </button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!href || !text}
          >
            {isEditMode ? "更新" : "挿入"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
