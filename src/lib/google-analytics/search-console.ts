import { google } from "googleapis"
import { unstable_cache } from "next/cache"
import path from "path"

const CACHE_DURATION = 60 * 60 // 1時間

let searchConsoleClient: any = null

export function getSearchConsoleClient() {
  if (!searchConsoleClient) {
    try {
      let auth: any

      // Check if credentials are provided as JSON string (for Vercel/production)
      if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
        auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
        })
      }
      // Fallback to file path (for local development)
      else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
        const absolutePath = path.isAbsolute(credentialsPath)
          ? credentialsPath
          : path.resolve(process.cwd(), credentialsPath)

        auth = new google.auth.GoogleAuth({
          keyFile: absolutePath,
          scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
        })
      }
      else {
        return null
      }

      searchConsoleClient = google.searchconsole({
        version: "v1",
        auth,
      })
    } catch (error) {
      console.error("[Search Console] Failed to initialize client:", error)
      if (error instanceof Error) {
        console.error("[Search Console] Error details:", error.message)
      }
      return null
    }
  }

  return searchConsoleClient
}

export interface SearchKeyword {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

async function fetchSearchKeywords(
  siteUrl: string,
  days: number,
  limit: number
): Promise<SearchKeyword[]> {
  const client = getSearchConsoleClient()
  if (!client) {
    return []
  }

  if (!siteUrl) {
    return []
  }

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  try {
    const response = await client.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ["query"],
        rowLimit: limit,
        dataState: "final",
      },
    })

    const result: SearchKeyword[] =
      response.data.rows?.map((row: any) => ({
        query: row.keys[0] || "",
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      })) || []

    // Sort by clicks descending
    result.sort((a, b) => b.clicks - a.clicks)

    return result
  } catch (error) {
    console.error("[Search Console] Error fetching search keywords:", error)
    if (error instanceof Error) {
      console.error("[Search Console] Error details:", error.message)
    }
    return []
  }
}

export async function getSearchKeywords(
  siteUrl: string,
  days: number = 30,
  limit: number = 20
): Promise<SearchKeyword[]> {
  const getCachedSearchKeywords = unstable_cache(
    async () => fetchSearchKeywords(siteUrl, days, limit),
    [`search-console-keywords-${siteUrl}-${days}-${limit}`],
    { revalidate: CACHE_DURATION }
  )
  return getCachedSearchKeywords()
}

export async function getSearchKeywordsByPage(
  siteUrl: string,
  days: number = 30,
  limit: number = 20
): Promise<any[]> {
  const client = getSearchConsoleClient()
  if (!client) {
    return []
  }

  if (!siteUrl) {
    return []
  }


  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  try {
    const response = await client.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ["query", "page"],
        rowLimit: limit,
        dataState: "final",
      },
    })

    const result =
      response.data.rows?.map((row: any) => ({
        query: row.keys[0] || "",
        page: row.keys[1] || "",
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      })) || []

    return result
  } catch (error) {
    // Silently return empty array if permission error or other API errors
    if (error instanceof Error && error.message.includes("permission")) {
    } else {
      console.error("[Search Console] Error fetching keywords by page:", error)
    }
    return []
  }
}
