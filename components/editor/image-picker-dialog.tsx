"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Check } from "lucide-react"
import Image from "next/image"

interface StorageFile {
  name: string
  id: string
}

interface ImagePickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (url: string) => void
}

export function ImagePickerDialog({
  open,
  onOpenChange,
  onSelect,
}: ImagePickerDialogProps) {
  const [images, setImages] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [customUrl, setCustomUrl] = useState("")
  const [activeTab, setActiveTab] = useState("library")

  useEffect(() => {
    if (open) {
      loadImages()
    }
  }, [open])

  const loadImages = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.storage
        .from("blog-images")
        .list("content", {
          limit: 50,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        })

      if (error) throw error
      setImages(data || [])
    } catch (err) {
      console.error("Failed to load images:", err)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (fileName: string) => {
    const supabase = createClient()
    const {
      data: { publicUrl },
    } = supabase.storage.from("blog-images").getPublicUrl(`content/${fileName}`)
    return publicUrl
  }

  const handleSelect = () => {
    if (activeTab === "library" && selectedImage) {
      onSelect(selectedImage)
      handleClose()
    } else if (activeTab === "url" && customUrl) {
      onSelect(customUrl)
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedImage(null)
    setCustomUrl("")
    setActiveTab("library")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>画像を選択</DialogTitle>
          <DialogDescription>
            ライブラリから画像を選択するか、URLを入力してください
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">ライブラリ</TabsTrigger>
            <TabsTrigger value="url">URLを入力</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : images.length === 0 ? (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">
                  画像がありません。画像管理ページからアップロードしてください。
                </p>
              </div>
            ) : (
              <div className="grid max-h-[400px] gap-3 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image) => {
                  const url = getImageUrl(image.name)
                  const isSelected = selectedImage === url

                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImage(url)}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        isSelected
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-transparent hover:border-muted-foreground/50"
                      }`}
                    >
                      <Image
                        src={url}
                        alt={image.name}
                        fill
                        className="object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                          <div className="rounded-full bg-primary p-1">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">画像URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                外部サイトの画像URLを入力してください
              </p>
            </div>
            {customUrl && (
              <div className="relative aspect-video overflow-hidden rounded-lg border">
                <Image
                  src={customUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => setCustomUrl("")}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleSelect}
            disabled={
              (activeTab === "library" && !selectedImage) ||
              (activeTab === "url" && !customUrl)
            }
          >
            挿入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
