import { getPublishedPosts, getCategories } from "@/lib/posts";
import { ArticleCard } from "@/app/(public)/_components/article-card";
import Link from "next/link";
import { getBaseURL } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "記事一覧",
  description: "すべての記事一覧",
  alternates: {
    canonical: `${getBaseURL()}/posts`,
  },
  openGraph: {
    title: "記事一覧",
    description: "すべての記事一覧",
    url: `${getBaseURL()}/posts`,
    images: [`${getBaseURL()}/api/og?title=${encodeURIComponent("記事一覧")}`],
  },
  twitter: {
    title: "記事一覧",
    description: "すべての記事一覧",
    images: [`${getBaseURL()}/api/og?title=${encodeURIComponent("記事一覧")}`],
  },
};

// ISRの再検証時間（秒） - 24時間ごとに再検証
export const revalidate = 86400;

export default async function PostsPage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  return (
    <div className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">すべての記事</h1>
        <p className="text-muted-foreground">
          {posts.length}件の記事があります
        </p>
      </div>

      {/* カテゴリフィルター */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/posts"
          className="rounded-full border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          すべて
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            style={{
              borderColor: category.color || "#e5e7eb",
              color: category.color || "#374151",
            }}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* 記事一覧 */}
      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">まだ記事がありません。</p>
        </div>
      )}
    </div>
  );
}
