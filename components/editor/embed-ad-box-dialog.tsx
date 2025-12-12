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
}

export function EmbedAdBoxDialog({
  open,
  onOpenChange,
  onInsert,
}: EmbedAdBoxDialogProps) {
  const [embedCode, setEmbedCode] = useState('')

  const handleInsert = () => {
    if (!embedCode.trim()) return

    onInsert(embedCode)

    // リセット
    setEmbedCode('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>埋め込み広告を挿入</DialogTitle>
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
            挿入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
