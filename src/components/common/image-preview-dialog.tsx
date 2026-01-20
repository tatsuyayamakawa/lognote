"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImagePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  alt?: string;
}

export function ImagePreviewDialog({
  open,
  onOpenChange,
  src,
  alt = "",
}: ImagePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 border-0 bg-transparent shadow-none"
        showCloseButton={false}
        style={{
          maxWidth: '98vw',
          maxHeight: '98vh',
          width: 'auto',
          height: 'auto',
        }}
      >
        <VisuallyHidden>
          <DialogTitle>画像プレビュー</DialogTitle>
          <DialogDescription>画像を拡大表示しています</DialogDescription>
        </VisuallyHidden>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 z-50 rounded-full bg-black/70 p-2 text-white hover:bg-black/90 transition-colors"
          aria-label="閉じる"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={src}
          alt={alt}
          className="max-w-[98vw] max-h-[98vh] w-auto h-auto object-contain rounded-lg block"
          style={{ cursor: 'zoom-out' }}
          onClick={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
