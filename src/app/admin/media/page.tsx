"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Copy, Trash2, Check, Search, X } from "lucide-react";
import { MobileMenuButton } from "../_components/mobile-menu-button";
import Image from "next/image";
import { ImageUploadDialog } from "./_components/image-upload-dialog";
import { ImageReuploadDialog } from "./_components/image-reupload-dialog";
import { Input } from "@/components/ui/input";

// クライアントコンポーネントなので、メタデータは別ファイルで設定する必要があります

interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
    postId?: string;
  };
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: any; // JSON content
}

export default function MediaPage() {
  const [images, setImages] = useState<StorageFile[]>([]);
  const [filteredImages, setFilteredImages] = useState<StorageFile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reuploadDialogOpen, setReuploadDialogOpen] = useState(false);
  const [selectedImageForReupload, setSelectedImageForReupload] = useState<{
    fileName: string;
    url: string;
  } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "unassigned">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadPosts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, slug, content")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

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
            postId: (file.metadata?.postId as string) || undefined,
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
    loadPosts();
    loadImages();
  }, []);

  // 画像URLから記事を検索するヘルパー関数
  const findPostsUsingImage = (imageUrl: string) => {
    return posts.filter((post) => {
      if (!post.content) return false;
      const contentStr = JSON.stringify(post.content);
      return contentStr.includes(imageUrl);
    });
  };

  // フィルタリング処理
  useEffect(() => {
    let filtered = images;

    // モードフィルター
    if (filterMode === "unassigned") {
      filtered = filtered.filter((img) => {
        // メタデータに記事IDがあるか
        if (img.metadata.postId) return false;

        // コンテンツ内で使用されているか確認
        const imageUrl = getImageUrl(img.name);
        const usingPosts = findPostsUsingImage(imageUrl);
        return usingPosts.length === 0;
      });
    }

    // 検索クエリフィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((img) => {
        const imageUrl = getImageUrl(img.name);

        // 1. 記事タイトルで検索
        const usingPosts = findPostsUsingImage(imageUrl);
        const titleMatch = usingPosts.some(post =>
          post.title.toLowerCase().includes(query)
        );

        // 2. スラッグで検索
        const slugMatch = usingPosts.some(post =>
          post.slug.toLowerCase().includes(query)
        );

        // 3. ファイル名でも検索（一応）
        const fileNameMatch = img.name.toLowerCase().includes(query);

        return titleMatch || slugMatch || fileNameMatch;
      });
    }

    // 作成日時でソート（新しい順）
    filtered = filtered.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    setFilteredImages(filtered);
  }, [images, filterMode, searchQuery, posts]);

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
        <div className="flex items-center gap-3">
          <MobileMenuButton />
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">画像管理</h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              記事で使用する画像を管理できます
            </p>
          </div>
        </div>
        <Button
          onClick={() => setUploadDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          <Upload className="mr-2 h-4 w-4" />
          画像をアップロード
        </Button>
      </div>

      {/* フィルタリング */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          <Button
            variant={filterMode === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterMode("all")}
          >
            すべて
          </Button>
          <Button
            variant={filterMode === "unassigned" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterMode("unassigned")}
          >
            未割当
          </Button>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="記事タイトルまたはファイル名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <span className="text-sm text-muted-foreground whitespace-nowrap bg-secondary px-3 py-1 rounded-full">
          {filteredImages.length}件
        </span>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden py-0">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-3 h-3 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredImages.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>画像がありません</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {images.length === 0
                ? "アップロードボタンから画像を追加してください"
                : "この条件に一致する画像がありません"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredImages.map((image) => {
            const url = getImageUrl(image.name);
            const isCopied = copiedUrl === url;

            return (
              <Card key={image.id} className="overflow-hidden py-0">
                <div
                  className="aspect-video relative bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                  onDoubleClick={() => {
                    setSelectedImageForReupload({
                      fileName: image.name,
                      url,
                    });
                    setReuploadDialogOpen(true);
                  }}
                  title="ダブルクリックで再アップロード"
                >
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

      {selectedImageForReupload && (
        <ImageReuploadDialog
          open={reuploadDialogOpen}
          onOpenChange={setReuploadDialogOpen}
          onUploadComplete={loadImages}
          imageFileName={selectedImageForReupload.fileName}
          imageUrl={selectedImageForReupload.url}
        />
      )}
    </div>
  );
}
