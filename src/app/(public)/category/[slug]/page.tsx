import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategoryBySlug,
  getPostsByCategoryWithPagination,
  getCategories,
  getCategorySlugs,
} from "@/lib/posts";
import { ArticleCard } from "@/app/(public)/_components/article-card";
import { getBaseURL } from "@/lib/utils";
import {
  CollectionPageJsonLd,
  BreadcrumbListJsonLd,
} from "@/components/seo/json-ld";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{ page?: string }>;
}

// メタデータ生成
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "カテゴリが見つかりません",
    };
  }

  const categoryUrl = `${getBaseURL()}/category/${category.slug}`;
  const description = category.description || `${category.name}の記事一覧`;

  const ogImageUrl = `${getBaseURL()}/api/og?title=${encodeURIComponent(category.name)}`;

  return {
    title: `${category.name}`,
    description: description,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: category.name,
      description: description,
      url: categoryUrl,
      images: [ogImageUrl],
    },
    twitter: {
      title: category.name,
      description: description,
      images: [ogImageUrl],
    },
  };
}

// ISRの再検証時間（秒） - 24時間ごとに再検証
export const revalidate = 86400;

// 静的パスの生成
export async function generateStaticParams() {
  const slugs = await getCategorySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const searchParamsData = await searchParams;
  const currentPage = Number(searchParamsData.page) || 1;

  const [category, { posts, totalPages }, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategoryWithPagination(slug, currentPage, 12),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const categoryUrl = `${getBaseURL()}/category/${category.slug}`;

  // パンくずリストデータ
  const breadcrumbItems = [
    { name: "ホーム", url: "/" },
    { name: "記事一覧", url: "/posts" },
    { name: category.name, url: `/category/${category.slug}` },
  ];

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
    <>
      <CollectionPageJsonLd
        category={category}
        url={categoryUrl}
        numberOfItems={posts.length}
      />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
      <div className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">ホーム</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/posts">記事一覧</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* カテゴリヘッダー */}
        <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <span
            className="inline-flex items-center rounded-full px-4 py-2 text-lg font-bold"
            style={{
              backgroundColor: category.color
                ? `${category.color}20`
                : "#e5e7eb",
              color: category.color || "#374151",
            }}
          >
            {category.name}
          </span>
        </div>
        {category.description && (
          <p className="text-lg text-muted-foreground">
            {category.description}
          </p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.length > 0 && `${(currentPage - 1) * 12 + 1}〜${(currentPage - 1) * 12 + posts.length}件を表示中`}
        </p>
        </div>

        {/* カテゴリフィルター */}
        <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href="/posts"
          className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          すべて
        </Link>
        {allCategories.map((cat) => {
          const isActive = cat.id === category.id;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              style={{
                backgroundColor: isActive
                  ? cat.color || "#e5e7eb"
                  : "transparent",
                borderColor: cat.color || "#e5e7eb",
                color: isActive ? "#ffffff" : cat.color || "#374151",
              }}
            >
              {cat.name}
            </Link>
          );
        })}
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
                          href={currentPage === 2 ? `/category/${slug}` : `/category/${slug}?page=${currentPage - 1}`}
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
                            href={page === 1 ? `/category/${slug}` : `/category/${slug}?page=${page}`}
                            size="icon"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      {currentPage < totalPages ? (
                        <PaginationNext href={`/category/${slug}?page=${currentPage + 1}`} size="default" />
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
            <p className="text-muted-foreground">
              このカテゴリにはまだ記事がありません。
            </p>
          </div>
        )}
      </div>
    </>
  );
}
