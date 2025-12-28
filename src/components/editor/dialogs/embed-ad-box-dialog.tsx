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
  onInsert: (embedCode?: string, pcEmbedCode?: string, mobileEmbedCode?: string) => void
  initialData?: {
    embedCode?: string
    pcEmbedCode?: string
    mobileEmbedCode?: string
  }
  isEditMode?: boolean
}

function EmbedAdBoxDialogContent({
  onOpenChange,
  onInsert,
  initialData,
  isEditMode = false,
}: Omit<EmbedAdBoxDialogProps, 'open'>) {
  const [pcEmbedCode, setPcEmbedCode] = useState(initialData?.pcEmbedCode || initialData?.embedCode || '')
  const [mobileEmbedCode, setMobileEmbedCode] = useState(initialData?.mobileEmbedCode || '')

  const handleInsert = () => {
    if (!pcEmbedCode.trim() && !mobileEmbedCode.trim()) return

    onInsert(undefined, pcEmbedCode, mobileEmbedCode)
    onOpenChange(false)
  }

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEditMode ? '埋め込み広告を編集' : '埋め込み広告を挿入'}</DialogTitle>
        <DialogDescription>
          PC用とスマホ用の広告コードを別々に登録することで、デバイス別のレポート分析が可能になります
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pc-embed-code">PC用広告コード</Label>
          <Textarea
            id="pc-embed-code"
            placeholder="<script>...</script> または <iframe>...</iframe>"
            value={pcEmbedCode}
            onChange={(e) => setPcEmbedCode(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            PC・タブレット表示用の広告コードを貼り付けてください
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile-embed-code">スマホ用広告コード</Label>
          <Textarea
            id="mobile-embed-code"
            placeholder="<script>...</script> または <iframe>...</iframe>"
            value={mobileEmbedCode}
            onChange={(e) => setMobileEmbedCode(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            スマホ表示用の広告コードを貼り付けてください（オプション）
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
          disabled={!pcEmbedCode.trim() && !mobileEmbedCode.trim()}
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
    ? `edit-${(initialData.pcEmbedCode || initialData.embedCode || '').slice(0, 20)}`
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
