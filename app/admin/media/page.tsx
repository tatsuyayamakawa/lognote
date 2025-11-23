"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2, Copy, Trash2, Check } from "lucide-react";
import Image from "next/image";
import { ImageUploadDialog } from "./_components/image-upload-dialog";

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

export default function MediaPage() {
  const [images, setImages] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const loadImages = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("blog-images")
        .list("content", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;
      setImages(
        (data || []).map((file) => ({
          name: file.name,
          id: file.id,
          updated_at: file.updated_at,
          created_at: file.created_at,
          metadata: {
            size: (file.metadata?.size as number) || 0,
            mimetype: (file.metadata?.mimetype as string) || "",
          },
        }))
      );
    } catch (err) {
      console.error("Failed to load images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const getImageUrl = (fileName: string) => {
    const supabase = createClient();
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("blog-images")
      .getPublicUrl(`content/${fileName}`);
    return publicUrl;
  };

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteImage = async (fileName: string) => {
    if (!confirm("この画像を削除しますか？")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.storage
        .from("blog-images")
        .remove([`content/${fileName}`]);

      if (error) throw error;

      // リストを更新
      await loadImages();
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("削除に失敗しました");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">画像管理</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            記事で使用する画像を管理できます
          </p>
        </div>
        <Button
          onClick={() => setUploadDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          <Upload className="mr-2 h-4 w-4" />
          画像をアップロード
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : images.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>画像がありません</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              アップロードボタンから画像を追加してください
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image) => {
            const url = getImageUrl(image.name);
            const isCopied = copiedUrl === url;

            return (
              <Card key={image.id} className="overflow-hidden py-0">
                <div className="aspect-video relative bg-muted">
                  <Image
                    src={url}
                    alt={image.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="mb-2 truncate text-sm font-medium">
                    {image.name}
                  </p>
                  <p className="mb-3 text-xs text-muted-foreground">
                    {(image.metadata.size / 1024).toFixed(1)} KB
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyToClipboard(url)}
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
                      onClick={() => deleteImage(image.name)}
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

      <ImageUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={loadImages}
      />
    </div>
  );
}
