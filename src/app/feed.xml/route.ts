import { getPublishedPosts } from '@/lib/posts'
import { getBaseURL } from '@/lib/utils'
import { works } from '@/app/(public)/works/_data/works'

export async function GET() {
  const baseUrl = getBaseURL()
  const posts = await getPublishedPosts(50) // 最新50件

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>整えて、創る。</title>
    <link>${baseUrl}</link>
    <description>身体を整え、思考を整え、コードを書く。日常・技術・気づきを発信します。</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${works
      .map(
        (work) => `
    <item>
      <title><![CDATA[【制作実績】${work.title}]]></title>
      <link>${baseUrl}/works/${work.id}</link>
      <guid isPermaLink="true">${baseUrl}/works/${work.id}</guid>
      <description><![CDATA[${work.description}]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <category>制作実績</category>
    </item>`
      )
      .join('')}
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.meta_description || post.title}]]></description>
      <pubDate>${new Date(post.published_at || post.created_at).toUTCString()}</pubDate>
      ${
        post.categories && post.categories.length > 0
          ? post.categories.map((cat) => `<category>${cat.name}</category>`).join('\n      ')
          : ''
      }
      ${post.thumbnail_url ? `<enclosure url="${post.thumbnail_url}" type="image/jpeg" />` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
