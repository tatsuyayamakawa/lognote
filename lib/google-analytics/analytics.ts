import { BetaAnalyticsDataClient } from "@google-analytics/data"
import path from "path"

let analyticsDataClient: BetaAnalyticsDataClient | null = null

export function getAnalyticsClient() {
  if (!analyticsDataClient) {
    console.log("[Analytics] Initializing GA4 client")
    console.log("[Analytics] GA4 Property ID:", process.env.GA4_PROPERTY_ID)

    try {
      // Check if credentials are provided as JSON string (for Vercel/production)
      if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        console.log("[Analytics] Using GOOGLE_SERVICE_ACCOUNT_JSON")
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
        analyticsDataClient = new BetaAnalyticsDataClient({
          credentials,
        })
      }
      // Fallback to file path (for local development)
      else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log("[Analytics] Using GOOGLE_APPLICATION_CREDENTIALS file path")
        const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
        const absolutePath = path.isAbsolute(credentialsPath)
          ? credentialsPath
          : path.resolve(process.cwd(), credentialsPath)

        console.log("[Analytics] Credentials path:", absolutePath)
        process.env.GOOGLE_APPLICATION_CREDENTIALS = absolutePath
        analyticsDataClient = new BetaAnalyticsDataClient()
      }
      else {
        console.warn("[Analytics] No credentials configured")
        return null
      }

      console.log("[Analytics] Client initialized successfully")
    } catch (error) {
      console.error("[Analytics] Failed to initialize client:", error)
      if (error instanceof Error) {
        console.error("[Analytics] Error details:", error.message)
      }
      return null
    }
  }

  return analyticsDataClient
}

export async function getPageViews(days: number = 30) {
  const client = getAnalyticsClient()
  if (!client) {
    console.warn("[Analytics] getPageViews: Client not initialized")
    return []
  }
  if (!process.env.GA4_PROPERTY_ID) {
    console.warn("[Analytics] getPageViews: GA4_PROPERTY_ID not set")
    return []
  }

  console.log(`[Analytics] Fetching page views for last ${days} days`)

  try {
    const [response] = await client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: `${days}daysAgo`,
          endDate: "today",
        },
      ],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "screenPageViews" }],
    })

    const result = response.rows?.map((row) => ({
      date: row.dimensionValues?.[0]?.value || "",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
    })) || []

    // Sort by date in ascending order (oldest to newest)
    result.sort((a, b) => a.date.localeCompare(b.date))

    console.log(`[Analytics] Page views fetched: ${result.length} data points`)
    return result
  } catch (error) {
    console.error("[Analytics] Error fetching page views:", error)
    if (error instanceof Error) {
      console.error("[Analytics] Error details:", error.message)
      console.error("[Analytics] Error stack:", error.stack)
    }
    return []
  }
}

export async function getTopPages(limit: number = 10) {
  const client = getAnalyticsClient()
  if (!client) {
    console.warn("[Analytics] getTopPages: Client not initialized")
    return []
  }
  if (!process.env.GA4_PROPERTY_ID) {
    console.warn("[Analytics] getTopPages: GA4_PROPERTY_ID not set")
    return []
  }

  console.log(`[Analytics] Fetching top ${limit} pages`)

  try {
    const [response] = await client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      // 管理画面と認証ページを除外
      dimensionFilter: {
        notExpression: {
          orGroup: {
            expressions: [
              {
                filter: {
                  fieldName: "pagePath",
                  stringFilter: {
                    matchType: "BEGINS_WITH",
                    value: "/admin",
                  },
                },
              },
              {
                filter: {
                  fieldName: "pagePath",
                  stringFilter: {
                    matchType: "BEGINS_WITH",
                    value: "/auth",
                  },
                },
              },
              {
                filter: {
                  fieldName: "pagePath",
                  stringFilter: {
                    matchType: "BEGINS_WITH",
                    value: "/api",
                  },
                },
              },
            ],
          },
        },
      },
      orderBys: [
        {
          metric: { metricName: "screenPageViews" },
          desc: true,
        },
      ],
      limit,
    })

    const result = response.rows?.map((row) => ({
      title: row.dimensionValues?.[0]?.value || "",
      path: row.dimensionValues?.[1]?.value || "",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
    })) || []

    console.log(`[Analytics] Top pages fetched: ${result.length} pages`)
    return result
  } catch (error) {
    console.error("[Analytics] Error fetching top pages:", error)
    if (error instanceof Error) {
      console.error("[Analytics] Error details:", error.message)
    }
    return []
  }
}

export async function getSearchQueries(limit: number = 20) {
  const client = getAnalyticsClient()
  if (!client) {
    console.warn("[Analytics] getSearchQueries: Client not initialized")
    return []
  }
  if (!process.env.GA4_PROPERTY_ID) {
    console.warn("[Analytics] getSearchQueries: GA4_PROPERTY_ID not set")
    return []
  }

  console.log(`[Analytics] Fetching top ${limit} search queries`)

  try {
    const [response] = await client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        { name: "sessionSource" },
        { name: "sessionMedium" },
        { name: "pageReferrer" },
      ],
      metrics: [{ name: "sessions" }, { name: "engagedSessions" }],
      dimensionFilter: {
        filter: {
          fieldName: "sessionSource",
          stringFilter: {
            value: "google",
          },
        },
      },
      orderBys: [
        {
          metric: { metricName: "sessions" },
          desc: true,
        },
      ],
      limit,
    })

    const result = response.rows?.map((row) => ({
      source: row.dimensionValues?.[0]?.value || "",
      medium: row.dimensionValues?.[1]?.value || "",
      referrer: row.dimensionValues?.[2]?.value || "",
      sessions: parseInt(row.metricValues?.[0]?.value || "0"),
      engagedSessions: parseInt(row.metricValues?.[1]?.value || "0"),
    })) || []

    console.log(`[Analytics] Search queries fetched: ${result.length} queries`)
    return result
  } catch (error) {
    console.error("[Analytics] Error fetching search queries:", error)
    if (error instanceof Error) {
      console.error("[Analytics] Error details:", error.message)
    }
    return []
  }
}

export async function getOrganicSearchStats(days: number = 30) {
  const client = getAnalyticsClient()
  if (!client) {
    console.warn("[Analytics] getOrganicSearchStats: Client not initialized")
    return []
  }
  if (!process.env.GA4_PROPERTY_ID) {
    console.warn("[Analytics] getOrganicSearchStats: GA4_PROPERTY_ID not set")
    return []
  }

  console.log(`[Analytics] Fetching organic search stats for last ${days} days`)

  try {
    const [response] = await client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: `${days}daysAgo`,
          endDate: "today",
        },
      ],
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "sessions" },
        { name: "engagedSessions" },
        { name: "averageSessionDuration" },
      ],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: "sessionSource",
                stringFilter: {
                  value: "google",
                },
              },
            },
            {
              filter: {
                fieldName: "sessionMedium",
                stringFilter: {
                  value: "organic",
                },
              },
            },
          ],
        },
      },
    })

    const result = response.rows?.map((row) => ({
      date: row.dimensionValues?.[0]?.value || "",
      sessions: parseInt(row.metricValues?.[0]?.value || "0"),
      engagedSessions: parseInt(row.metricValues?.[1]?.value || "0"),
      avgDuration: parseFloat(row.metricValues?.[2]?.value || "0"),
    })) || []

    // Sort by date in ascending order (oldest to newest)
    result.sort((a, b) => a.date.localeCompare(b.date))

    console.log(`[Analytics] Organic search stats fetched: ${result.length} data points`)
    return result
  } catch (error) {
    console.error("[Analytics] Error fetching organic search stats:", error)
    if (error instanceof Error) {
      console.error("[Analytics] Error details:", error.message)
    }
    return []
  }
}
