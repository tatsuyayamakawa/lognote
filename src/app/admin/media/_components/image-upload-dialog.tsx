"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload, Loader2, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete: () => void
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  onUploadComplete,
}: ImageUploadDialogProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("ファイルサイズは10MB以下にしてください")
      return
    }

    // ファイルタイプチェック
    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください")
      return
    }

    setSelectedFile(file)
    setError(null)

    // プレビュー生成
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.url) {
        throw new Error(data.error || "アップロードに失敗しました")
      }

      // 成功したらダイアログを閉じて親コンポーネントに通知
      onUploadComplete()
      handleClose()
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "アップロードに失敗しました")
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>画像をアップロード</DialogTitle>
          <DialogDescription>
            記事で使用する画像をアップロードします（最大10MB）
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {previewUrl ? (
            <div className="relative aspect-video overflow-hidden rounded-lg border">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
                disabled={uploading}
                className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-dashed p-12">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  画像を選択してください
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

          {!previewUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              ファイルを選択
            </Button>
          )}

          {selectedFile && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                アップロード中...
              </>
            ) : (
              "アップロード"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
