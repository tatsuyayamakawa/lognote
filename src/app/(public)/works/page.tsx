import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBaseURL } from "@/lib/utils";
import { works, getWorkImagePath } from "./_data/works";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "制作実績",
  description: "これまでに制作したWebサイトやアプリケーションの実績をご紹介します。",
  alternates: {
    canonical: `${getBaseURL()}/works`,
  },
  openGraph: {
    url: `${getBaseURL()}/works`,
    title: "制作実績",
    description: "これまでに制作したWebサイトやアプリケーションの実績をご紹介します。",
  },
  twitter: {
    title: "制作実績",
    description: "これまでに制作したWebサイトやアプリケーションの実績をご紹介します。",
  },
};

export default function WorksPage() {
  return (
    <section className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
              <BreadcrumbPage>制作実績</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ページヘッダー */}
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">制作実績</h1>
          <p className="text-lg text-muted-foreground">
            これまでに制作したWebサイトやアプリケーションの実績をご紹介します
          </p>
        </header>

        {/* 制作実績グリッド */}
        {works.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <Link
                key={work.id}
                href={`/works/${work.id}`}
                className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
              >
                {/* サムネイル画像 */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    src={getWorkImagePath(work.id, work.thumbnail)}
                    alt={work.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* カード内容 */}
                <div className="p-6">
                  {/* カテゴリー */}
                  <div className="mb-2">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {work.category}
                    </span>
                  </div>

                  {/* タイトル */}
                  <h2 className="mb-2 text-xl font-bold group-hover:text-primary">
                    {work.title}
                  </h2>

                  {/* 説明文 */}
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {work.description}
                  </p>

                  {/* リリース日 */}
                  <div className="mb-4 text-xs text-muted-foreground">
                    <span className="font-medium">リリース:</span> {work.releaseDate}
                  </div>

                  {/* 技術スタック */}
                  <div className="flex flex-wrap gap-2">
                    {work.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-border bg-background px-2 py-1 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {work.technologies.length > 3 && (
                      <span className="rounded border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground">
                        +{work.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              現在、制作実績を準備中です。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
