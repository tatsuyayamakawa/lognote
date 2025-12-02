"use client"

import { useState, useEffect, useRef } from "react"
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
import { Loader2, Check, Upload, X } from "lucide-react"
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
  const [activeTab, setActiveTab] = useState("upload")
  const [uploading, setUploading] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("ファイルサイズは10MB以下にしてください")
      return
    }

    // ファイルタイプチェック
    if (!file.type.startsWith("image/")) {
      setUploadError("画像ファイルを選択してください")
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      // プレビュー用のURLを生成
      const previewUrl = URL.createObjectURL(file)
      setUploadPreview(previewUrl)

      // 画像をアップロード
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.url) {
        throw new Error(data.error || "アップロードに失敗しました")
      }

      // アップロード成功したら即座に挿入
      onSelect(data.url)
      handleClose()
    } catch (err) {
      console.error("Upload error:", err)
      setUploadError(err instanceof Error ? err.message : "アップロードに失敗しました")
    } finally {
      setUploading(false)
      // input要素をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveUpload = () => {
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview)
    }
    setUploadPreview(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
    setActiveTab("upload")
    setUploadPreview(null)
    setUploadError(null)
    setUploading(false)
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>画像を挿入</DialogTitle>
          <DialogDescription>
            画像をアップロード、ライブラリから選択、またはURLを入力してください
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">アップロード</TabsTrigger>
            <TabsTrigger value="library">ライブラリ</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {uploadPreview ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src={uploadPreview}
                  alt="Upload preview"
                  fill
                  className="object-cover"
                />
                {!uploading && (
                  <button
                    type="button"
                    onClick={handleRemoveUpload}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    画像を選択してアップロード
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF (最大10MB)
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  アップロード中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadPreview ? "別の画像を選択" : "画像を選択"}
                </>
              )}
            </Button>

            {uploadError && (
              <p className="text-sm text-destructive">{uploadError}</p>
            )}
          </TabsContent>

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
