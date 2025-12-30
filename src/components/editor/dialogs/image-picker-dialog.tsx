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

interface ImageData {
  src: string
  alt?: string
  caption?: string
}

interface ImagePickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (data: ImageData) => void
  postId?: string // 現在編集中の記事ID（任意）
  initialData?: ImageData // 編集モード用の初期データ
  simpleMode?: boolean // trueの場合、画像URLのみ選択（alt/captionなし）
}

export function ImagePickerDialog({
  open,
  onOpenChange,
  onSelect,
  postId,
  initialData,
  simpleMode = false,
}: ImagePickerDialogProps) {
  const [images, setImages] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  // 初期値を直接セット（initialDataがあればそれを使用、なければnull/空文字）
  const [selectedImage, setSelectedImage] = useState<string | null>(initialData?.src || null)
  const [customUrl, setCustomUrl] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const [uploading, setUploading] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showMetadataForm, setShowMetadataForm] = useState(!!initialData)
  const [alt, setAlt] = useState(initialData?.alt || "")
  const [caption, setCaption] = useState(initialData?.caption || "")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const IMAGES_PER_PAGE = 50

  useEffect(() => {
    if (open) {
      // ダイアログが開かれたときは初期化してから読み込み
      setImages([])
      setOffset(0)
      setHasMore(true)
      loadImages(true)
    }
  }, [open])

  const loadImages = async (reset = false) => {
    if (reset) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const supabase = createClient()
      const currentOffset = reset ? 0 : offset

      const { data, error } = await supabase.storage
        .from("blog-images")
        .list("content", {
          limit: IMAGES_PER_PAGE,
          offset: currentOffset,
          sortBy: { column: "created_at", order: "desc" },
        })

      if (error) throw error

      const newImages = data || []

      if (reset) {
        setImages(newImages)
        setOffset(IMAGES_PER_PAGE)
      } else {
        setImages(prev => [...prev, ...newImages])
        setOffset(prev => prev + IMAGES_PER_PAGE)
      }

      // 取得した画像数がlimitより少なければ、これ以上ない
      setHasMore(newImages.length === IMAGES_PER_PAGE)
    } catch (err) {
      console.error("Failed to load images:", err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadImages(false)
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

      // 記事IDがあれば一緒に送信
      if (postId) {
        formData.append("postId", postId)
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.url) {
        throw new Error(data.error || "アップロードに失敗しました")
      }

      // アップロード成功したら、メタデータ入力画面へ
      setSelectedImage(data.url)
      setShowMetadataForm(true)
      setUploading(false)
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

  const handleSelectImage = () => {
    if (activeTab === "library" && selectedImage) {
      setShowMetadataForm(true)
    } else if (activeTab === "url" && customUrl) {
      setSelectedImage(customUrl)
      setShowMetadataForm(true)
    }
  }

  const handleInsert = () => {
    const url = selectedImage || customUrl
    if (url) {
      onSelect({
        src: url,
        alt: alt.trim() || undefined,
        caption: caption.trim() || undefined,
      })
      handleClose()
    }
  }

  const handleBack = () => {
    setShowMetadataForm(false)
    setAlt("")
    setCaption("")
  }

  const handleClose = () => {
    setSelectedImage(null)
    setCustomUrl("")
    setActiveTab("upload")
    setUploadPreview(null)
    setUploadError(null)
    setUploading(false)
    setShowMetadataForm(false)
    setAlt("")
    setCaption("")
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview)
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      key={initialData?.src || 'new'}
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {showMetadataForm ? "画像情報を入力" : "画像を挿入"}
          </DialogTitle>
          <DialogDescription>
            {showMetadataForm
              ? "alt属性とキャプションを入力してください（任意）"
              : "画像をアップロード、ライブラリから選択、またはURLを入力してください"}
          </DialogDescription>
        </DialogHeader>

        {showMetadataForm ? (
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border">
              <Image
                src={selectedImage || customUrl}
                alt="Selected image"
                fill
                className="object-cover"
              />
            </div>

            {!simpleMode && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alt">代替テキスト (alt)</Label>
                  <Input
                    id="alt"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    placeholder="画像の説明を入力"
                  />
                  <p className="text-xs text-muted-foreground">
                    画像が表示されない場合やスクリーンリーダー用のテキストです
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">キャプション</Label>
                  <Input
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="画像の説明文"
                  />
                  <p className="text-xs text-muted-foreground">
                    画像の下に表示される説明文です
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
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
              <div className="space-y-3">
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
                {hasMore && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="w-full"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        読み込み中...
                      </>
                    ) : (
                      `もっと見る（${images.length}件表示中）`
                    )}
                  </Button>
                )}
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
        )}

        <DialogFooter>
          {showMetadataForm ? (
            <>
              <Button type="button" variant="outline" onClick={handleBack}>
                戻る
              </Button>
              <Button type="button" onClick={handleInsert}>
                挿入
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
                キャンセル
              </Button>
              <Button
                type="button"
                onClick={handleSelectImage}
                disabled={
                  (activeTab === "library" && !selectedImage) ||
                  (activeTab === "url" && !customUrl)
                }
              >
                次へ
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
