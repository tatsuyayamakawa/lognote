import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPageHeader } from "../_components/admin-page-header";
import { MediaGallery } from "./_components/media-gallery";
import { MediaUploadButton } from "./_components/media-upload-button";
import { MediaFilterStatic } from "./_components/media-filter";
import { MediaPagination } from "./_components/media-pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "画像管理",
};

const IMAGES_PER_PAGE = 20;

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

interface Post {
  id: string;
  title: string;
  slug: string;
  content: unknown;
}

interface GetImagesParams {
  page: number;
  filter: "all" | "unassigned";
  search: string;
  posts: Post[];
}

async function getImages({ page, filter, search, posts }: GetImagesParams): Promise<{ images: ImageRecord[]; total: number }> {
  const supabase = await createClient();

  // 未割当フィルタ用: 使用中の画像URLを特定
  let usedImageUrls: Set<string> | null = null;
  if (filter === "unassigned") {
    usedImageUrls = new Set<string>();
    for (const post of posts) {
      if (post.content) {
        const contentStr = JSON.stringify(post.content);
        // URLを抽出（blog-imagesを含むURL）
        const urlMatches = contentStr.match(/https:\/\/[^"]+blog-images[^"]+/g);
        if (urlMatches) {
          urlMatches.forEach((url) => usedImageUrls!.add(url));
        }
      }
    }
  }

  // 検索用: 記事タイトル/スラッグに一致する画像URLを特定
  let searchMatchUrls: Set<string> | null = null;
  if (search) {
    const query = search.toLowerCase();
    searchMatchUrls = new Set<string>();
    for (const post of posts) {
      const titleMatch = post.title.toLowerCase().includes(query);
      const slugMatch = post.slug.toLowerCase().includes(query);
      if (titleMatch || slugMatch) {
        if (post.content) {
          const contentStr = JSON.stringify(post.content);
          const urlMatches = contentStr.match(/https:\/\/[^"]+blog-images[^"]+/g);
          if (urlMatches) {
            urlMatches.forEach((url) => searchMatchUrls!.add(url));
          }
        }
      }
    }
  }

  // 検索フィルタ: ファイル名で検索
  if (search) {
    // 記事タイトル/スラッグでの一致も含める場合はURLリストも使用
    if (searchMatchUrls && searchMatchUrls.size > 0) {
      const urlArray = Array.from(searchMatchUrls);
      // 全画像を取得してフィルタ（Supabaseのor+inは複雑なのでシンプルに）
      const { data: allImages, error: allError } = await supabase
        .from("images")
        .select("*")
        .order("created_at", { ascending: false });

      if (allError) {
        console.error("Failed to load images:", allError);
        return { images: [], total: 0 };
      }

      // クライアントサイドでフィルタ
      let filtered = (allImages || []).filter((img) => {
        const fileNameMatch = img.file_name.toLowerCase().includes(search.toLowerCase());
        const urlMatch = urlArray.includes(img.url);
        return fileNameMatch || urlMatch;
      });

      // 未割当フィルタも適用
      if (filter === "unassigned" && usedImageUrls) {
        filtered = filtered.filter((img) => !img.post_id && !usedImageUrls.has(img.url));
      }

      const total = filtered.length;
      const offset = (page - 1) * IMAGES_PER_PAGE;
      const images = filtered.slice(offset, offset + IMAGES_PER_PAGE);

      return { images, total };
    }
  }

  // 通常のクエリ構築
  let countQuery = supabase.from("images").select("*", { count: "exact", head: true });
  let dataQuery = supabase.from("images").select("*");

  // 未割当フィルタ: post_idがnullで、コンテンツでも使われていない
  if (filter === "unassigned" && usedImageUrls) {
    countQuery = countQuery.is("post_id", null);
    dataQuery = dataQuery.is("post_id", null);

    // usedImageUrlsに含まれないものを取得するため、全取得してフィルタ
    if (usedImageUrls.size > 0) {
      const { data: allImages, error: allError } = await supabase
        .from("images")
        .select("*")
        .is("post_id", null)
        .order("created_at", { ascending: false });

      if (allError) {
        console.error("Failed to load images:", allError);
        return { images: [], total: 0 };
      }

      const filtered = (allImages || []).filter((img) => !usedImageUrls.has(img.url));
      const total = filtered.length;
      const offset = (page - 1) * IMAGES_PER_PAGE;
      const images = filtered.slice(offset, offset + IMAGES_PER_PAGE);

      return { images, total };
    }
  }

  // ファイル名のみで検索
  if (search) {
    countQuery = countQuery.ilike("file_name", `%${search}%`);
    dataQuery = dataQuery.ilike("file_name", `%${search}%`);
  }

  // 総数を取得
  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error("Failed to count images:", countError);
    return { images: [], total: 0 };
  }

  const total = count || 0;
  const offset = (page - 1) * IMAGES_PER_PAGE;

  // ページネーション付きで取得
  const { data, error } = await dataQuery
    .order("created_at", { ascending: false })
    .range(offset, offset + IMAGES_PER_PAGE - 1);

  if (error) {
    console.error("Failed to load images:", error);
    return { images: [], total: 0 };
  }

  return { images: data || [], total };
}

async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, content")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load posts:", error);
    return [];
  }

  return data || [];
}

async function MediaContent({
  page,
  filter,
  search
}: {
  page: number;
  filter: "all" | "unassigned";
  search: string;
}) {
  // postsを先に取得（フィルタリングに必要）
  const posts = await getPosts();
  const { images, total } = await getImages({ page, filter, search, posts });
  const totalPages = Math.ceil(total / IMAGES_PER_PAGE);

  return (
    <>
      <MediaGallery
        images={images}
        total={total}
        currentFilter={filter}
        currentSearch={search}
      />
      {totalPages > 1 && (
        <MediaPagination
          currentPage={page}
          totalPages={totalPages}
          filter={filter}
          search={search}
        />
      )}
    </>
  );
}

function MediaGallerySkeleton() {
  return (
    <>
      {/* フィルター（静的表示） */}
      <MediaFilterStatic />

      {/* 画像グリッド */}
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
    </>
  );
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string; search?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const filter = (params.filter === "unassigned" ? "unassigned" : "all") as "all" | "unassigned";
  const search = params.search || "";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="画像管理"
        description="記事で使用する画像を管理できます"
      >
        <MediaUploadButton />
      </AdminPageHeader>

      <Suspense key={`${currentPage}-${filter}-${search}`} fallback={<MediaGallerySkeleton />}>
        <MediaContent page={currentPage} filter={filter} search={search} />
      </Suspense>
    </div>
  );
}
