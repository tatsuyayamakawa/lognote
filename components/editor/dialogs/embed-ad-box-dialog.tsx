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
import { Textarea } from "@/components/ui/textarea"

interface EmbedAdBoxDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsert: (embedCode: string) => void
  initialData?: {
    embedCode: string
  }
  isEditMode?: boolean
}

function EmbedAdBoxDialogContent({
  onOpenChange,
  onInsert,
  initialData,
  isEditMode = false,
}: Omit<EmbedAdBoxDialogProps, 'open'>) {
  const [embedCode, setEmbedCode] = useState(initialData?.embedCode || '')

  const handleInsert = () => {
    if (!embedCode.trim()) return

    onInsert(embedCode)
    onOpenChange(false)
  }

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{isEditMode ? '埋め込み広告を編集' : '埋め込み広告を挿入'}</DialogTitle>
        <DialogDescription>
          A8.net、もしもアフィリエイトなどの埋め込みコードを貼り付けてください
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="embed-code">埋め込みコード</Label>
          <Textarea
            id="embed-code"
            placeholder="<script>...</script> または <iframe>...</iframe>"
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
            rows={10}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            A8.net、もしもアフィリエイト、バリューコマースなどの広告コードをそのまま貼り付けてください
          </p>
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
          disabled={!embedCode.trim()}
        >
          {isEditMode ? '更新' : '挿入'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export function EmbedAdBoxDialog({
  open,
  onOpenChange,
  onInsert,
  initialData,
  isEditMode = false,
}: EmbedAdBoxDialogProps) {
  // keyを使ってコンポーネントを完全にリマウントすることで状態をリセット
  const dialogKey = isEditMode && initialData
    ? `edit-${initialData.embedCode.slice(0, 20)}`
    : 'new';

  return (
    <Dialog key={dialogKey} open={open} onOpenChange={onOpenChange}>
      <EmbedAdBoxDialogContent
        onOpenChange={onOpenChange}
        onInsert={onInsert}
        initialData={initialData}
        isEditMode={isEditMode}
      />
    </Dialog>
  )
}
