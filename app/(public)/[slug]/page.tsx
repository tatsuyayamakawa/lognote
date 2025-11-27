import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPostBySlug,
  getPublishedPostSlugs,
  getRelatedPosts,
} from "@/lib/posts";
import { formatDate, getBaseURL } from "@/lib/utils";
import { TiptapRendererWithAds } from "@/components/editor/tiptap-renderer-with-ads";
import { ShareButtons } from "@/components/post/share-buttons";
import { RelatedPosts } from "@/components/post/related-posts";
import { ArticleJsonLd, BreadcrumbListJsonLd } from "@/components/seo/json-ld";
import { ResponsiveAd } from "@/components/ads/responsive-ad";
import { DualAd } from "@/components/ads/dual-ad";
import { AdSense } from "@/components/ads/adsense";
import { getAdSettings } from "@/lib/ad-settings";
import { TableOfContents } from "@/components/post/table-of-contents";
import { Profile } from "@/components/home/profile";
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

// ISRの再検証時間（秒） - 24時間ごとに再検証
export const revalidate = 86400;

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

  // 関連記事と広告設定を取得
  const categoryIds = post.categories?.map((c) => c.id) || [];
  const [relatedPosts, adSettings] = await Promise.all([
    getRelatedPosts(post.id, categoryIds, 3),
    getAdSettings(),
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

      <div className="flex-1">
        {/* パンくずリスト（max-w-7xl） */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground whitespace-nowrap">
              ホーム
            </Link>
            <span className="select-none">/</span>
            <Link href="/posts" className="hover:text-foreground whitespace-nowrap">
              記事一覧
            </Link>
            <span className="select-none">/</span>
            <span className="text-foreground wrap-break-word min-w-0">
              {post.title}
            </span>
          </nav>
        </div>

        {/* ヘッダーセクション（タイトル・メタ情報 - max-w-4xl） */}
        <div className="mx-auto max-w-4xl px-4 pb-8 sm:px-6 lg:px-8">
            {/* カテゴリ */}
            {post.categories && post.categories.length > 0 && (
              <div className="mb-6 flex flex-wrap justify-center gap-2">
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

            {/* タイトル（左揃え） */}
            <h1 className="mb-6 text-left text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* メタ情報（中央揃え） */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={post.published_at || post.created_at}>
                    公開: {formatDate(post.published_at || post.created_at)}
                  </time>
                </div>
                {post.updated_at && post.updated_at !== post.published_at && (
                  <div className="hidden md:flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <time dateTime={post.updated_at}>
                      更新: {formatDate(post.updated_at)}
                    </time>
                  </div>
                )}
              </div>
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
        </div>

        {/* 記事上広告（タイトル下・ファーストビュー） */}
        {(adSettings?.article_top_pc_slot || adSettings?.article_top_mobile_slot) && (
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <ResponsiveAd
              pcSlot={adSettings?.article_top_pc_slot}
              mobileSlot={adSettings?.article_top_mobile_slot}
              pcConfig={{
                width: "728px",
                height: "90px",
                adFormat: "horizontal",
                fullWidthResponsive: false,
              }}
              mobileConfig={{
                width: "300px",
                height: "250px",
                adFormat: "rectangle",
                fullWidthResponsive: false,
              }}
            />
          </div>
        )}

        {/* コンテンツセクション */}
        <div className="mx-auto max-w-7xl pb-8 md:px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
            {/* メインコンテンツ */}
            <article className="min-w-0 md:bg-card md:rounded-lg md:border px-4 py-6 md:p-8 lg:p-12">

        {/* 記事本文（記事内広告対応） */}
        {post.content && (
          <TiptapRendererWithAds
            content={post.content as string}
            inArticlePcSlot={adSettings?.in_article_pc_slot}
            inArticleMobileSlot={adSettings?.in_article_mobile_slot}
          />
        )}

        {/* 記事下広告（コンテンツ後） */}
        {(adSettings?.article_bottom_pc_slot_1 ||
          adSettings?.article_bottom_pc_slot_2 ||
          adSettings?.article_bottom_mobile_slot) && (
          <div className="my-10">
            {/* PC: rectangle 300x250 2つ横並び */}
            <DualAd
              slot1={adSettings?.article_bottom_pc_slot_1}
              slot2={adSettings?.article_bottom_pc_slot_2}
              width="300px"
              height="250px"
            />
            {/* スマホ: rectangle 300x250 1つ */}
            {adSettings?.article_bottom_mobile_slot && (
              <div className="block md:hidden text-center">
                <span className="text-xs text-muted-foreground block mb-1">
                  スポンサーリンク
                </span>
                <AdSense
                  adSlot={adSettings.article_bottom_mobile_slot}
                  width="300px"
                  height="250px"
                  adFormat="rectangle"
                  fullWidthResponsive={false}
                />
              </div>
            )}
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

            {/* 右サイドバー - プロフィール・目次（PCのみ）320px固定 */}
            <aside className="hidden xl:block">
              <div className="sticky top-4 space-y-6">
                {/* プロフィール */}
                <Profile />

                {/* 目次 */}
                <div className="bg-card rounded-lg border p-5">
                  <TableOfContents />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
