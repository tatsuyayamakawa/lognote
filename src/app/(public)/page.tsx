import Image from "next/image";
import Link from "next/link";
import {
  getPublishedPosts,
  getCategories,
  getFeaturedPosts,
} from "@/lib/posts";
import { ArticleCard } from "@/app/(public)/_components/article-card";
import { WebsiteJsonLd } from "@/components/seo/json-ld";
import { getBaseURL } from "@/lib/utils";
import { Sidebar } from "@/components/home/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "整えて、創る。 - ネット集客に強い整体院サイトを制作",
  description:
    "身体を整え、思考を整え、コードを書く。ネット集客に強い整体院サイトを制作。",
  alternates: {
    canonical: getBaseURL(),
  },
  openGraph: {
    url: getBaseURL(),
    title: "整えて、創る。",
    description:
      "身体を整え、思考を整え、コードを書く。ネット集客に強い整体院サイトを制作。",
  },
  twitter: {
    title: "整えて、創る。",
    description:
      "身体を整え、思考を整え、コードを書く。ネット集客に強い整体院サイトを制作。",
  },
};

// ISRの再検証時間（秒） - 24時間ごとに再検証
export const revalidate = 86400;

export default async function Home() {
  const [featuredPosts, recentPosts, categories] = await Promise.all([
    getFeaturedPosts(3), // 特集記事を取得（最大3件）
    getPublishedPosts(6), // 最新記事を取得（6件）
    getCategories(),
  ]);

  const siteUrl = getBaseURL();

  return (
    <>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7839828582645189"
        crossOrigin="anonymous"
      />
      <WebsiteJsonLd url={siteUrl} />
      {/* ヒーローセクション */}
      <section className="relative h-[50vh] w-full xl:h-[70vh]">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="text-center text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              整えて、創る。
            </h1>
            <p className="text-lg md:text-xl">
              身体を整え、思考を整え、コードを書く
            </p>
          </div>
        </div>
      </section>

      {/* 特集記事セクション */}
      {featuredPosts.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">特集記事</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                注目の記事をピックアップ
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredPosts.map((post) => (
                <ArticleCard key={post.id} post={post} priority />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* メインコンテンツ - 2カラムレイアウト */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインカラム */}
          <main className="flex-1 min-w-0">
            {/* カテゴリナビゲーション */}
            <div className="mb-8 flex flex-wrap gap-3">
              <Link
                href="/posts"
                className="rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
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

            {/* 最新記事セクション */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">最新の記事</h2>
                <Link
                  href="/posts"
                  className="text-sm text-primary hover:underline"
                >
                  すべて見る →
                </Link>
              </div>

              {recentPosts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {recentPosts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-12 text-center">
                  <p className="text-muted-foreground">
                    まだ記事がありません。
                  </p>
                </div>
              )}
            </section>
          </main>

          {/* サイドバー */}
          <Sidebar categories={categories} />
        </div>
      </div>
    </>
  );
}
