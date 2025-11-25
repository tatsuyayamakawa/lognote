import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategoryBySlug,
  getPostsByCategory,
  getCategories,
  getCategorySlugs,
} from "@/lib/posts";
import { ArticleCard } from "@/app/(public)/_components/article-card";
import { getBaseURL } from "@/lib/utils";
import {
  CollectionPageJsonLd,
  BreadcrumbListJsonLd,
} from "@/components/seo/json-ld";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
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
      type: "website",
      siteName: "整えて、創る。",
    },
    twitter: {
      card: "summary_large_image",
      title: category.name,
      description: description,
    },
  };
}

// 静的パスの生成
export async function generateStaticParams() {
  const slugs = await getCategorySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, posts, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategory(slug),
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

  return (
    <>
      <CollectionPageJsonLd
        category={category}
        url={categoryUrl}
        numberOfItems={posts.length}
      />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <nav className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground whitespace-nowrap">
            ホーム
          </Link>
          <span className="select-none">/</span>
          <Link href="/posts" className="hover:text-foreground whitespace-nowrap">
            記事一覧
          </Link>
          <span className="select-none">/</span>
          <span className="text-foreground wrap-break-word min-w-0">
            {category.name}
          </span>
        </nav>

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
          {posts.length}件の記事
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
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
