import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PostsTable } from "./posts-table";
import { PostsFilter } from "./posts-filter";
import { PostsTableSkeleton } from "./posts-table-skeleton";
import { AdminPageHeader } from "../_components/admin-page-header";
import type { Post, Category } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "記事管理",
};

const POSTS_PER_PAGE = 10;

async function getPosts(page: number = 1, status?: string) {
  const supabase = await createClient();

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

async function PostsTableWrapper({
  page,
  status,
}: {
  page: number;
  status: string;
}) {
  const { posts, total } = await getPosts(page, status);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <PostsTable
      posts={posts}
      currentPage={page}
      totalPages={totalPages}
      currentStatus={status}
    />
  );
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const { page = "1", status = "all" } = await searchParams;
  const currentPage = parseInt(page, 10);

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <AdminPageHeader
        title="記事管理"
        description="すべての記事を管理します"
      >
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Link>
        </Button>
      </AdminPageHeader>

      {/* フィルター */}
      <PostsFilter currentStatus={status} />

      {/* 記事テーブル */}
      <Suspense key={`${currentPage}-${status}`} fallback={<PostsTableSkeleton />}>
        <PostsTableWrapper page={currentPage} status={status} />
      </Suspense>
    </div>
  );
}
