import type { PostWithCategories, Category } from "@/types"
import { getBaseURL } from "@/lib/utils"

interface ArticleJsonLdProps {
  post: PostWithCategories
  url: string
}

export function ArticleJsonLd({ post, url }: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.meta_description || post.title,
    image: post.thumbnail_url || undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: "整えて、創る。",
    },
    publisher: {
      "@type": "Organization",
      name: "整えて、創る。",
      logo: {
        "@type": "ImageObject",
        url: `${getBaseURL()}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.categories?.map((c) => c.name).join(", "),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface WebsiteJsonLdProps {
  url: string
}

export function WebsiteJsonLd({ url }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "整えて、創る。",
    description: "身体を整え、思考を整え、コードを書く。日常・技術・気づきを発信します。",
    url: url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/posts?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbListJsonLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbListJsonLd({ items }: BreadcrumbListJsonLdProps) {
  const baseUrl = getBaseURL()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface CollectionPageJsonLdProps {
  category: Category
  url: string
  numberOfItems: number
}

export function CollectionPageJsonLd({
  category,
  url,
  numberOfItems,
}: CollectionPageJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description || `${category.name}の記事一覧`,
    url: url,
    isPartOf: {
      "@type": "WebSite",
      name: "整えて、創る。",
      url: getBaseURL(),
    },
    numberOfItems: numberOfItems,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
