"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Lightbulb, AlertTriangle, AlertCircle, CheckCircle, Info } from "lucide-react"

interface PointBoxDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsert: (data: {
    type: 'point' | 'warning' | 'danger' | 'success' | 'info'
    title: string
    content: string
  }) => void
  initialData?: {
    type?: 'point' | 'warning' | 'danger' | 'success' | 'info'
    title?: string
    content?: string
  }
  isEditMode?: boolean
}

export function PointBoxDialog({
  open,
  onOpenChange,
  onInsert,
  initialData,
  isEditMode = false,
}: PointBoxDialogProps) {
  // 初期データがある場合はそれを使用、なければデフォルト値
  const [selectedType, setSelectedType] = useState<'point' | 'warning' | 'danger' | 'success' | 'info'>(
    initialData?.type || 'point'
  )
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')

  const types = [
    { value: 'point' as const, label: 'ポイント', icon: Lightbulb, color: 'text-blue-600' },
    { value: 'warning' as const, label: '注意', icon: AlertTriangle, color: 'text-yellow-600' },
    { value: 'danger' as const, label: '危険', icon: AlertCircle, color: 'text-red-600' },
    { value: 'success' as const, label: 'ヒント', icon: CheckCircle, color: 'text-green-600' },
    { value: 'info' as const, label: '情報', icon: Info, color: 'text-gray-600' },
  ]

  const handleInsert = () => {
    if (!content.trim()) return

    onInsert({
      type: selectedType,
      title: title.trim() || types.find(t => t.value === selectedType)?.label || '',
      content: content.trim(),
    })

    // リセット
    if (!isEditMode) {
      setSelectedType('point')
      setTitle('')
      setContent('')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'ポイントボックスを編集' : 'ポイントボックスを挿入'}</DialogTitle>
          <DialogDescription>
            ボックスの種類を選択し、内容を入力してください
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* タイプ選択 */}
          <div className="space-y-2">
            <Label>ボックスの種類</Label>
            <div className="grid grid-cols-5 gap-2">
              {types.map((type) => {
                const Icon = type.icon
                return (
                  <Button
                    key={type.value}
                    type="button"
                    variant={selectedType === type.value ? "default" : "outline"}
                    className="h-20 flex-col gap-1"
                    onClick={() => setSelectedType(type.value)}
                  >
                    <Icon className={`h-6 w-6 ${selectedType === type.value ? '' : type.color}`} />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* タイトル */}
          <div className="space-y-2">
            <Label htmlFor="title">タイトル（省略可）</Label>
            <Input
              id="title"
              placeholder={types.find(t => t.value === selectedType)?.label}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 内容 */}
          <div className="space-y-2">
            <Label htmlFor="content">内容 *</Label>
            <Textarea
              id="content"
              placeholder="ポイントボックスの内容を入力してください"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleInsert}
            disabled={!content.trim()}
          >
            {isEditMode ? '更新' : '挿入'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
