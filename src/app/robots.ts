import { MetadataRoute } from 'next'
import { getBaseURL } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseURL()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
