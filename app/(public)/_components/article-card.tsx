import Link from "next/link";
import Image from "next/image";
import { Post, Category } from "@/types";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  post: Post & { categories?: Category[] };
  showExcerpt?: boolean;
  priority?: boolean;
}

export function ArticleCard({ post, showExcerpt = true, priority = false }: ArticleCardProps) {
  // サムネイルURLを決定（カスタムサムネイルまたは動的生成）
  const thumbnailUrl =
    post.thumbnail_url || `/api/og?title=${encodeURIComponent(post.title)}`;

  return (
    <Link href={`/${post.slug}`}>
      <article className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg">
        {/* サムネイル */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
        </div>

        <div className="p-6">
          {/* カテゴリ */}
          {post.categories && post.categories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: category.color
                      ? `${category.color}20`
                      : "#e5e7eb",
                    color: category.color || "#374151",
                  }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* タイトル */}
          <h3 className="mb-2 line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          {/* 抜粋 */}
          {showExcerpt && post.excerpt && (
            <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
              {post.excerpt}
            </p>
          )}

          {/* メタ情報 */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <time dateTime={post.published_at || post.created_at}>
              {formatDate(post.published_at || post.created_at)}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
}
