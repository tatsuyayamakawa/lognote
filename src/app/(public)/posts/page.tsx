import { getPublishedPostsWithPagination, getCategories } from "@/lib/posts";
import { ArticleCard } from "@/app/(public)/_components/article-card";
import Link from "next/link";
import { getBaseURL } from "@/lib/utils";
import type { Metadata } from "next";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

interface PostsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  const [{ posts, totalPages }, categories] = await Promise.all([
    getPublishedPostsWithPagination(currentPage, 12),
    getCategories(),
  ]);

  // ページ番号の配列を生成（最大7個表示）
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // 7ページ以下なら全て表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 現在のページ周辺のみ表示
      if (currentPage <= 3) {
        // 最初の方
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 最後の方
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 真ん中
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">すべての記事</h1>
        <p className="text-muted-foreground">
          {posts.length > 0 && `${(currentPage - 1) * 12 + 1}〜${(currentPage - 1) * 12 + posts.length}件を表示中`}
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
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    {currentPage > 1 ? (
                      <PaginationPrevious
                        href={currentPage === 2 ? "/posts" : `/posts?page=${currentPage - 1}`}
                        size="default"
                      />
                    ) : (
                      <span className="flex items-center gap-1 pl-2.5 h-10 px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed">
                        <span>前へ</span>
                      </span>
                    )}
                  </PaginationItem>

                  {getPageNumbers().map((page, index) =>
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : page === currentPage ? (
                      <PaginationItem key={page}>
                        <span
                          aria-current="page"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium cursor-not-allowed"
                        >
                          {page}
                        </span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={page === 1 ? "/posts" : `/posts?page=${page}`}
                          size="icon"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    {currentPage < totalPages ? (
                      <PaginationNext href={`/posts?page=${currentPage + 1}`} size="default" />
                    ) : (
                      <span className="flex items-center gap-1 pr-2.5 h-10 px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed">
                        <span>次へ</span>
                      </span>
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">まだ記事がありません。</p>
        </div>
      )}
    </div>
  );
}
