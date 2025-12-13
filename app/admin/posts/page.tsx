import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PostsTable } from "./posts-table";
import { syncViewCountsFromAnalytics } from "@/lib/posts";
import type { Post, Category } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "記事管理",
};

const POSTS_PER_PAGE = 10;

async function getPosts(page: number = 1) {
  const supabase = await createClient();

  // Google Analyticsから閲覧数を同期（キャッシュ処理は後で追加予定）
  try {
    await syncViewCountsFromAnalytics();
  } catch (error) {
    console.error("Failed to sync view counts:", error);
    // 同期に失敗してもページは表示する
  }

  // まず総件数を取得
  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      post_categories (
        category:categories (*)
      )
    `
    )
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], total: 0 };
  }

  const postsWithCategories = (posts || []).map(
    (
      post: Post & {
        post_categories?: Array<{ category: Category | null }> | null;
      }
    ) => ({
      ...post,
      categories:
        post.post_categories
          ?.map((pc: { category: Category | null }) => pc.category)
          .filter((cat: Category | null): cat is Category => Boolean(cat)) ||
        [],
    })
  );

  return { posts: postsWithCategories, total: count || 0 };
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10);
  const { posts, total } = await getPosts(currentPage);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">記事管理</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            すべての記事を管理します（{total}件）
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </div>

      {/* 記事テーブル */}
      <PostsTable
        posts={posts}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
