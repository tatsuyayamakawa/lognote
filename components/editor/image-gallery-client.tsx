"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export function ImageGalleryClient() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string
    alt?: string
    caption?: string
  } | null>(null)

  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // 画像ギャラリー内の画像がクリックされたかチェック
      if (target.tagName === "IMG" && target.closest(".image-gallery-item")) {
        e.preventDefault()

        const img = target as HTMLImageElement
        const caption = img.parentElement?.querySelector("p")?.textContent || undefined

        setSelectedImage({
          src: img.src,
          alt: img.alt,
          caption,
        })
      }
    }

    // クリックイベントをリスン
    document.addEventListener("click", handleImageClick)

    return () => {
      document.removeEventListener("click", handleImageClick)
    }
  }, [])

  return (
    <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden">
        <DialogTitle className="sr-only">画像を拡大表示</DialogTitle>
        {selectedImage && (
          <div className="relative">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt || ""}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            {selectedImage.caption && (
              <div className="p-4 bg-background">
                <p className="text-sm text-muted-foreground text-center">
                  {selectedImage.caption}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
