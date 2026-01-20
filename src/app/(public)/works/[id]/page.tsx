import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseURL } from "@/lib/utils";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { works, getWorkImagePath } from "../_data/works";
import { ScreenshotGallery } from "./screenshot-gallery";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return works.map((work) => ({
    id: work.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const work = works.find((w) => w.id === id);

  if (!work) {
    return {
      title: "制作実績が見つかりません",
    };
  }

  const url = `${getBaseURL()}/works/${id}`;

  return {
    title: `${work.title} - 制作実績`,
    description: work.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title: work.title,
      description: work.description,
      images: [
        {
          url: getWorkImagePath(work.id, work.thumbnail),
          width: 1200,
          height: 630,
          alt: work.title,
        },
      ],
    },
    twitter: {
      title: work.title,
      description: work.description,
      images: [getWorkImagePath(work.id, work.thumbnail)],
    },
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { id } = await params;
  const work = works.find((w) => w.id === id);

  if (!work) {
    notFound();
  }

  return (
    <article className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">ホーム</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/works">制作実績</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{work.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* メインビジュアル */}
        <figure className="mb-8">
          <div className="relative w-full overflow-hidden rounded-lg border bg-muted" style={{ aspectRatio: '1200/675' }}>
            <Image
              src={getWorkImagePath(work.id, work.thumbnail)}
              alt={work.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          </div>
        </figure>

        {/* ヘッダー情報 */}
        <header className="mb-12">
          <div className="mb-4 flex flex-wrap gap-2">
            {work.category.map((cat) => (
              <span key={cat} className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                {cat}
              </span>
            ))}
          </div>
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{work.title}</h1>
          <p className="text-lg text-muted-foreground">{work.description}</p>
        </header>

        {/* 基本情報 */}
        <section className="mb-12" aria-labelledby="basic-info-heading">
          <h2 id="basic-info-heading" className="sr-only">基本情報</h2>
          <div className="grid gap-6 rounded-lg border bg-card p-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">リリース日</h3>
              <p className="font-medium">{work.releaseDate}</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">ステータス</h3>
              <p className="font-medium">{work.status}</p>
            </div>
            {work.url && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">URL</h3>
                <a
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-medium text-primary hover:underline"
                >
                  サイトを見る
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </section>

        {/* 技術スタック */}
        <section className="mb-12" aria-labelledby="tech-stack-heading">
          <h2 id="tech-stack-heading" className="mb-4 text-2xl font-bold">技術スタック</h2>
          <div className="flex flex-wrap gap-3">
            {work.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border bg-card px-4 py-2 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* 主な機能 */}
        {work.features && work.features.length > 0 && (
          <section className="mb-12" aria-labelledby="features-heading">
            <h2 id="features-heading" className="mb-4 text-2xl font-bold">主な機能</h2>
            <ul className="space-y-3">
              {work.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 技術的な課題と解決 */}
        {work.challenges && work.challenges.length > 0 && (
          <section className="mb-12" aria-labelledby="challenges-heading">
            <h2 id="challenges-heading" className="mb-4 text-2xl font-bold">技術的な課題と解決</h2>
            <ul className="space-y-3">
              {work.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-3 text-primary">•</span>
                  <span className="text-muted-foreground">{challenge}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* その他の画像 */}
        {work.images && work.images.length > 0 && (
          <section className="mb-12" aria-labelledby="screenshots-heading">
            <h2 id="screenshots-heading" className="sr-only">スクリーンショットギャラリー</h2>
            <ScreenshotGallery workId={work.id} workTitle={work.title} images={work.images} />
          </section>
        )}

        {/* フッターナビゲーション */}
        <nav className="mt-16 border-t pt-8" aria-label="関連ページへのナビゲーション">
          <Link
            href="/works"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            すべての制作実績を見る
          </Link>
        </nav>
      </div>
    </article>
  );
}
