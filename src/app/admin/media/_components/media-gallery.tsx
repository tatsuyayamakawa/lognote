"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash2, Check, Search, X } from "lucide-react";
import Image from "next/image";
import { ImageReuploadDialog } from "./image-reupload-dialog";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteImage as deleteImageAction } from "../_actions/image-actions";

interface ImageRecord {
  id: string;
  file_name: string;
  storage_path: string;
  url: string;
  size: number;
  mimetype: string | null;
  post_id: string | null;
  created_at: string;
  updated_at: string;
}

interface MediaGalleryProps {
  images: ImageRecord[];
  total: number;
  currentFilter: "all" | "unassigned";
  currentSearch: string;
}

export function MediaGallery({
  images,
  total,
  currentFilter,
  currentSearch,
}: MediaGalleryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reuploadDialogOpen, setReuploadDialogOpen] = useState(false);
  const [selectedImageForReupload, setSelectedImageForReupload] = useState<{
    fileName: string;
    url: string;
  } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    // フィルタや検索が変わったらページを1に戻す
    if ("filter" in updates || "search" in updates) {
      params.delete("page");
    }

    const queryString = params.toString();
    router.push(`/admin/media${queryString ? `?${queryString}` : ""}`);
  };

  const handleFilterChange = (filter: "all" | "unassigned") => {
    updateSearchParams({ filter: filter === "all" ? null : filter });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ search: searchInput.trim() || null });
  };

  const clearSearch = () => {
    setSearchInput("");
    updateSearchParams({ search: null });
  };

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteImage = async (fileName: string) => {
    if (!confirm("この画像を削除しますか？")) return;

    const result = await deleteImageAction(fileName);

    if (!result.success) {
      console.error("Failed to delete image:", result.error);
      alert("削除に失敗しました");
      return;
    }

    router.refresh();
  };

  return (
    <>
      {/* フィルタリング */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          <Button
            variant={currentFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("all")}
          >
            すべて
          </Button>
          <Button
            variant={currentFilter === "unassigned" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("unassigned")}
          >
            未割当
          </Button>
        </div>

        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="記事タイトルまたはファイル名で検索..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 pr-9"
          />
          {(searchInput || currentSearch) && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <span className="text-sm text-muted-foreground whitespace-nowrap bg-secondary px-3 py-1 rounded-full">
          {total}件
        </span>
      </div>

      {/* 画像グリッド */}
      {images.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>画像がありません</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {currentFilter === "all" && !currentSearch
                ? "アップロードボタンから画像を追加してください"
                : "この条件に一致する画像がありません"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image) => {
            const isCopied = copiedUrl === image.url;

            return (
              <Card key={image.id} className="overflow-hidden py-0">
                <div
                  className="aspect-video relative bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                  onDoubleClick={() => {
                    setSelectedImageForReupload({
                      fileName: image.file_name,
                      url: image.url,
                    });
                    setReuploadDialogOpen(true);
                  }}
                  title="ダブルクリックで再アップロード"
                >
                  <Image
                    src={image.url}
                    alt={image.file_name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="mb-2 truncate text-sm font-medium">
                    {image.file_name}
                  </p>
                  <p className="mb-3 text-xs text-muted-foreground">
                    {(image.size / 1024).toFixed(1)} KB
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyToClipboard(image.url)}
                    >
                      {isCopied ? (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          コピー済み
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1 h-3 w-3" />
                          URLコピー
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteImage(image.file_name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedImageForReupload && (
        <ImageReuploadDialog
          open={reuploadDialogOpen}
          onOpenChange={setReuploadDialogOpen}
          onUploadComplete={() => router.refresh()}
          imageFileName={selectedImageForReupload.fileName}
          imageUrl={selectedImageForReupload.url}
        />
      )}
    </>
  );
}
