import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import type { PostWithCategories } from "@/types"

interface RelatedPostsProps {
  posts: PostWithCategories[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="mb-6 text-2xl font-bold">関連記事</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.slug}`}
            className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
          >
            <div className="aspect-video relative overflow-hidden bg-muted">
              <Image
                src={post.thumbnail_url || `/api/og?title=${encodeURIComponent(post.title)}`}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              {post.categories && post.categories.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {post.categories.slice(0, 2).map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
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
              <h3 className="mb-2 line-clamp-2 font-semibold group-hover:text-primary">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
              <time className="text-xs text-muted-foreground">
                {formatDate(post.published_at || post.created_at)}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
