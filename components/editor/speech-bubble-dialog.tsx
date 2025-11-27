"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MessageSquare, MessageSquareText } from "lucide-react"

interface SpeechBubbleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (position: "left" | "right") => void
}

export function SpeechBubbleDialog({
  open,
  onOpenChange,
  onSelect,
}: SpeechBubbleDialogProps) {
  const handleSelect = (position: "left" | "right") => {
    onSelect(position)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>吹き出しを挿入</DialogTitle>
          <DialogDescription>
            吹き出しの位置を選択してください
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => handleSelect("left")}
          >
            <MessageSquare className="h-8 w-8" />
            <span>左側</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-24 flex-col gap-2"
            onClick={() => handleSelect("right")}
          >
            <MessageSquareText className="h-8 w-8" />
            <span>右側</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
