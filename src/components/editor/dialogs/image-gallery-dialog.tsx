"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import { ImagePickerDialog } from "./image-picker-dialog";
import Image from "next/image";

interface ImageItem {
  src: string;
  alt?: string;
  caption?: string;
}

interface ImageGalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    images: ImageItem[];
    columns: number;
    gap: number;
  }) => void;
  initialData?: {
    images: ImageItem[];
    columns: number;
    gap: number;
  };
  isEditMode?: boolean;
}

function ImageGalleryDialogContent({
  onOpenChange,
  onSubmit,
  initialData,
  isEditMode = false,
}: Omit<ImageGalleryDialogProps, 'open'>) {
  const [images, setImages] = useState<ImageItem[]>(
    initialData?.images || [{ src: "", alt: "", caption: "" }]
  );
  const [columns, setColumns] = useState(initialData?.columns || 2);
  const [gap, setGap] = useState(initialData?.gap || 16);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  const handleAddImage = () => {
    setImages([...images, { src: "", alt: "", caption: "" }]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, field: keyof ImageItem, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const handleSelectImage = (index: number) => {
    setCurrentImageIndex(index);
    setImagePickerOpen(true);
  };

  const handleImageSelected = (data: { src: string; alt?: string; caption?: string }) => {
    if (currentImageIndex !== null) {
      const newImages = [...images];
      newImages[currentImageIndex] = {
        src: data.src,
        alt: data.alt || "",
        caption: data.caption || "",
      };
      setImages(newImages);
    }
    setImagePickerOpen(false);
    setCurrentImageIndex(null);
  };

  const handleSubmit = () => {
    const validImages = images.filter(img => img.src.trim() !== "");
    if (validImages.length === 0) {
      alert("最低1枚の画像を追加してください");
      return;
    }
    onSubmit({
      images: validImages,
      columns,
      gap,
    });
    onOpenChange(false);
  };

  return (
    <>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>{isEditMode ? '画像ギャラリーを編集' : '画像ギャラリーを追加'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* レイアウト設定 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>カラム数</Label>
              <Select value={columns.toString()} onValueChange={(v) => setColumns(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1列</SelectItem>
                  <SelectItem value="2">2列</SelectItem>
                  <SelectItem value="3">3列</SelectItem>
                  <SelectItem value="4">4列</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>画像間の余白</Label>
              <Select value={gap.toString()} onValueChange={(v) => setGap(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">小 (8px)</SelectItem>
                  <SelectItem value="16">中 (16px)</SelectItem>
                  <SelectItem value="24">大 (24px)</SelectItem>
                  <SelectItem value="32">特大 (32px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 画像リスト */}
          <div className="space-y-2">
            <Label>画像 ({images.length}枚)</Label>
            {images.map((image, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 relative bg-muted/30">
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  type="button"
                >
                  <X size={20} />
                </button>

                <div className="space-y-2">
                  <Label className="text-xs">画像URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={image.src}
                      onChange={(e) => handleImageChange(index, "src", e.target.value)}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleSelectImage(index)}
                    >
                      <ImageIcon size={16} />
                    </Button>
                  </div>
                </div>

                {image.src && (
                  <div className="w-full h-32 border rounded overflow-hidden relative">
                    <Image
                      src={image.src}
                      alt={image.alt || ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-xs">Alt テキスト（任意）</Label>
                  <Input
                    value={image.alt || ""}
                    onChange={(e) => handleImageChange(index, "alt", e.target.value)}
                    placeholder="画像の説明"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">キャプション（任意）</Label>
                  <Input
                    value={image.caption || ""}
                    onChange={(e) => handleImageChange(index, "caption", e.target.value)}
                    placeholder="画像の説明文"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddImage}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              画像を追加
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? '更新' : '追加'}
          </Button>
        </DialogFooter>
      </DialogContent>

      <ImagePickerDialog
        open={imagePickerOpen}
        onOpenChange={setImagePickerOpen}
        onSelect={handleImageSelected}
      />
    </>
  );
}

export function ImageGalleryDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditMode = false,
}: ImageGalleryDialogProps) {
  // keyを使ってコンポーネントを完全にリマウントすることで状態をリセット
  const dialogKey = isEditMode && initialData
    ? `edit-${initialData.images[0]?.src || 'gallery'}`
    : 'new';

  return (
    <Dialog key={dialogKey} open={open} onOpenChange={onOpenChange}>
      <ImageGalleryDialogContent
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
        initialData={initialData}
        isEditMode={isEditMode}
      />
    </Dialog>
  );
}
