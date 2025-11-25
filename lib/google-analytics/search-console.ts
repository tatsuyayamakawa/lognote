import { google } from "googleapis"
import path from "path"

let searchConsoleClient: any = null

export function getSearchConsoleClient() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn("[Search Console] Credentials not configured")
    return null
  }

  if (!searchConsoleClient) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    const absolutePath = path.isAbsolute(credentialsPath)
      ? credentialsPath
      : path.resolve(process.cwd(), credentialsPath)

    console.log("[Search Console] Initializing client")
    console.log("[Search Console] Credentials path:", absolutePath)

    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: absolutePath,
        scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
      })

      searchConsoleClient = google.searchconsole({
        version: "v1",
        auth,
      })

      console.log("[Search Console] Client initialized successfully")
    } catch (error) {
      console.error("[Search Console] Failed to initialize client:", error)
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

export async function getSearchKeywords(
  siteUrl: string,
  days: number = 30,
  limit: number = 20
): Promise<SearchKeyword[]> {
  const client = getSearchConsoleClient()
  if (!client) {
    console.warn("[Search Console] getSearchKeywords: Client not initialized")
    return []
  }

  if (!siteUrl) {
    console.warn("[Search Console] getSearchKeywords: Site URL not provided")
    return []
  }

  console.log(`[Search Console] Fetching top ${limit} search keywords for last ${days} days`)

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

    console.log(`[Search Console] Search keywords fetched: ${result.length} keywords`)
    return result
  } catch (error) {
    console.error("[Search Console] Error fetching search keywords:", error)
    if (error instanceof Error) {
      console.error("[Search Console] Error details:", error.message)
    }
    return []
  }
}

export async function getSearchKeywordsByPage(
  siteUrl: string,
  days: number = 30,
  limit: number = 20
): Promise<any[]> {
  const client = getSearchConsoleClient()
  if (!client) {
    console.warn("[Search Console] getSearchKeywordsByPage: Client not initialized")
    return []
  }

  if (!siteUrl) {
    console.warn("[Search Console] getSearchKeywordsByPage: Site URL not provided")
    return []
  }

  console.log(`[Search Console] Fetching search keywords by page for last ${days} days`)

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

    console.log(`[Search Console] Keywords by page fetched: ${result.length} items`)
    return result
  } catch (error) {
    console.error("[Search Console] Error fetching keywords by page:", error)
    if (error instanceof Error) {
      console.error("[Search Console] Error details:", error.message)
    }
    return []
  }
}
