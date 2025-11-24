import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getPostBySlug,
  getPublishedPostSlugs,
  getRelatedPosts,
} from "@/lib/posts";
import { formatDate, getBaseURL } from "@/lib/utils";
import { TiptapRenderer } from "@/components/editor/tiptap-renderer";
import { ShareButtons } from "@/components/post/share-buttons";
import { RelatedPosts } from "@/components/post/related-posts";
import { ArticleJsonLd, BreadcrumbListJsonLd } from "@/components/seo/json-ld";
import { AdSense } from "@/components/ads/adsense";
import { getAdsByLocation } from "@/lib/ads";
import type { Metadata } from "next";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// メタデータ生成
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "記事が見つかりません",
    };
  }

  const postUrl = `${getBaseURL()}/${post.slug}`;
  const keywords = post.categories?.map((c) => c.name) || [];

  return {
    title: `${post.title}`,
    description: post.meta_description || post.excerpt || post.title,
    keywords: keywords,
    authors: [{ name: "整えて、創る。" }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt || post.title,
      url: postUrl,
      images: post.thumbnail_url ? [post.thumbnail_url] : [],
      type: "article",
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: ["整えて、創る。"],
      siteName: "整えて、創る。",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_description || post.excerpt || post.title,
      images: post.thumbnail_url ? [post.thumbnail_url] : [],
    },
  };
}

// 静的パスの生成
export async function generateStaticParams() {
  const slugs = await getPublishedPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // 関連記事と広告を取得
  const categoryIds = post.categories?.map((c) => c.id) || [];
  const [relatedPosts, articleTopAd, articleBottomAd] = await Promise.all([
    getRelatedPosts(post.id, categoryIds, 3),
    getAdsByLocation("article_top"),
    getAdsByLocation("article_bottom"),
  ]);

  const postUrl = `${getBaseURL()}/${post.slug}`;

  // パンくずリストデータ
  const breadcrumbItems = [
    { name: "ホーム", url: "/" },
    { name: "記事一覧", url: "/posts" },
    { name: post.title, url: `/${post.slug}` },
  ];

  return (
    <>
      <ArticleJsonLd post={post} url={postUrl} />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ホーム
          </Link>
          <span>/</span>
          <Link href="/posts" className="hover:text-foreground">
            記事一覧
          </Link>
          <span>/</span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        {/* カテゴリ */}
        {post.categories && post.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: category.color
                    ? `${category.color}20`
                    : "#e5e7eb",
                  color: category.color || "#374151",
                }}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* タイトル */}
        <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
          {post.title}
        </h1>

        {/* メタ情報 */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={post.published_at || post.created_at}>
            {formatDate(post.published_at || post.created_at)}
          </time>
          {post.view_count > 0 && (
            <span className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {post.view_count.toLocaleString()}
            </span>
          )}
        </div>

        {/* サムネイル */}
        <div className="mb-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={
              post.thumbnail_url ||
              `/api/og?title=${encodeURIComponent(post.title)}`
            }
            alt={post.title}
            width={1200}
            height={630}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        {/* 記事上広告 */}
        {articleTopAd && (
          <div className="mb-8">
            <AdSense
              adSlot={articleTopAd.ad_slot}
              adFormat="auto"
              fullWidthResponsive={true}
            />
          </div>
        )}

        {/* 記事本文 */}
        {post.content && <TiptapRenderer content={post.content} />}

        {/* 記事下広告 */}
        {articleBottomAd && (
          <div className="mt-8">
            <AdSense
              adSlot={articleBottomAd.ad_slot}
              adFormat="auto"
              fullWidthResponsive={true}
            />
          </div>
        )}

        {/* シェアボタン */}
        <div className="mt-12 border-t pt-8">
          <ShareButtons
            url={postUrl}
            title={post.title}
            description={post.excerpt || post.title}
          />
        </div>

        {/* 関連記事 */}
        <RelatedPosts posts={relatedPosts} />
      </article>
    </>
  );
}
