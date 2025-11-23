import Link from "next/link";
import { getPublishedPosts, getCategories } from "@/lib/posts";
import { getBaseURL } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "サイトマップ",
  description: "整えて、創る。のサイトマップ - すべてのページ一覧",
  alternates: {
    canonical: `${getBaseURL()}/site-map`,
  },
};

export default async function SitemapPage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">サイトマップ</h1>
        <p className="text-muted-foreground">
          当サイトのすべてのページ一覧です
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* メインページ */}
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-bold">メインページ</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="text-primary hover:underline"
              >
                トップページ
              </Link>
            </li>
            <li>
              <Link
                href="/posts"
                className="text-primary hover:underline"
              >
                記事一覧
              </Link>
            </li>
            <li>
              <Link
                href="/site-map"
                className="text-primary hover:underline"
              >
                サイトマップ
              </Link>
            </li>
          </ul>
        </section>

        {/* カテゴリ */}
        <section className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-bold">
            カテゴリ ({categories.length})
          </h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-primary hover:underline"
                  style={{ color: category.color || undefined }}
                >
                  {category.name}
                  {category.description && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      - {category.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 記事一覧 */}
        <section className="col-span-full rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-bold">
            記事一覧 ({posts.length}件)
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="space-y-1">
                <Link
                  href={`/${post.slug}`}
                  className="block font-medium text-primary hover:underline"
                >
                  {post.title}
                </Link>
                {post.excerpt && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(
                    post.published_at || post.created_at
                  ).toLocaleDateString("ja-JP")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* フィード */}
        <section className="col-span-full rounded-lg border bg-muted/50 p-6">
          <h2 className="mb-4 text-xl font-bold">フィード</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/feed.xml"
                className="text-primary hover:underline"
                target="_blank"
              >
                RSS Feed
              </Link>
              <span className="ml-2 text-sm text-muted-foreground">
                - ブログリーダーで購読
              </span>
            </li>
            <li>
              <Link
                href="/sitemap.xml"
                className="text-primary hover:underline"
                target="_blank"
              >
                XML Sitemap
              </Link>
              <span className="ml-2 text-sm text-muted-foreground">
                - 検索エンジン用
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
