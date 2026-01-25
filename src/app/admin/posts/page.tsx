import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PostsTable } from "./posts-table";
import { AdminPageHeader } from "../_components/admin-page-header";
import { syncViewCountsFromAnalytics } from "@/lib/posts";
import type { Post, Category } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "記事管理",
};

const POSTS_PER_PAGE = 10;

async function getPosts(page: number = 1, status?: string) {
  const supabase = await createClient();

  // Google Analyticsから閲覧数を同期（キャッシュ処理は後で追加予定）
  try {
    await syncViewCountsFromAnalytics();
  } catch (error) {
    console.error("Failed to sync view counts:", error);
    // 同期に失敗してもページは表示する
  }

  // ステータスでフィルタリングするクエリを構築
  let query = supabase.from("posts").select("*", { count: "exact", head: true });
  
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { count } = await query;

  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  let postsQuery = supabase
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

  if (status && status !== "all") {
    postsQuery = postsQuery.eq("status", status);
  }

  const { data: posts, error } = await postsQuery;

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
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { page = "1", status = "all" } = await searchParams;
  const currentPage = parseInt(page, 10);
  const { posts, total } = await getPosts(currentPage, status);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <AdminPageHeader
        title="記事管理"
        description={`すべての記事を管理します（${total}件）`}
      >
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </AdminPageHeader>

      {/* 記事テーブル */}
      <PostsTable
        posts={posts}
        currentPage={currentPage}
        totalPages={totalPages}
        currentStatus={status}
      />
    </div>
  );
}
