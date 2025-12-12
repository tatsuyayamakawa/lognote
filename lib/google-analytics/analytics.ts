import { BetaAnalyticsDataClient } from "@google-analytics/data"
import path from "path"

let analyticsDataClient: BetaAnalyticsDataClient | null = null

export function getAnalyticsClient() {
  if (!analyticsDataClient) {
    try {
      // Check if credentials are provided as JSON string (for Vercel/production)
      if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
        analyticsDataClient = new BetaAnalyticsDataClient({
          credentials,
        })
      }
      // Fallback to file path (for local development)
      else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
        const absolutePath = path.isAbsolute(credentialsPath)
          ? credentialsPath
          : path.resolve(process.cwd(), credentialsPath)

        process.env.GOOGLE_APPLICATION_CREDENTIALS = absolutePath
        analyticsDataClient = new BetaAnalyticsDataClient()
      }
      else {
        return null
      }
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
    return []
  }
  if (!process.env.GA4_PROPERTY_ID) {
    return []
  }

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

    return result
  } catch (error) {
    console.error("[Analytics] Error fetching page views:", error)
    if (error instanceof Error) {
      console.error("[Analytics] Error details:", error.message)
    }
    return []
  }
}

export async function getTopPages(limit: number = 10, days: number = 30) {
  const client = getAnalyticsClient()
  if (!client) {
    return []
  }
  if (!process.env.GA4_PROPERTY_ID) {
    return []
  }


  try {
    const [response] = await client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: `${days}daysAgo`,
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
    return []
  }
  if (!process.env.GA4_PROPERTY_ID) {
    return []
  }


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
    return []
  }
  if (!process.env.GA4_PROPERTY_ID) {
    return []
  }


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

    return result
  } catch (error) {
    console.error("[Analytics] Error fetching organic search stats:", error)
    if (error instanceof Error) {
      console.error("[Analytics] Error details:", error.message)
    }
    return []
  }
}

/**
 * 記事ごとの閲覧数を取得（全期間）
 */
export async function getPostViewCounts() {
  const client = getAnalyticsClient()
  if (!client) {
    return []
  }
  if (!process.env.GA4_PROPERTY_ID) {
    return []
  }


  try {
    const [response] = await client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: "2020-01-01", // 十分に古い日付から集計
          endDate: "today",
        },
      ],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      // 記事ページのみ取得（/で始まり、/admin、/auth、/apiなどを除外）
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: "pagePath",
                stringFilter: {
                  matchType: "BEGINS_WITH",
                  value: "/",
                },
              },
            },
            {
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
                    {
                      filter: {
                        fieldName: "pagePath",
                        stringFilter: {
                          matchType: "EXACT",
                          value: "/",
                        },
                      },
                    },
                    {
                      filter: {
                        fieldName: "pagePath",
                        stringFilter: {
                          matchType: "BEGINS_WITH",
                          value: "/posts",
                        },
                      },
                    },
                    {
                      filter: {
                        fieldName: "pagePath",
                        stringFilter: {
                          matchType: "BEGINS_WITH",
                          value: "/category",
                        },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      orderBys: [
        {
          metric: { metricName: "screenPageViews" },
          desc: true,
        },
      ],
    })

    const result = response.rows?.map((row) => {
      const pagePath = row.dimensionValues?.[0]?.value || ""
      // スラッグを抽出（先頭の/を除去）
      const slug = pagePath.startsWith("/") ? pagePath.substring(1) : pagePath

      return {
        slug,
        views: parseInt(row.metricValues?.[0]?.value || "0"),
      }
    }) || []

    return result
  } catch (error) {
    console.error("[Analytics] Error fetching post view counts:", error)
    if (error instanceof Error) {
      console.error("[Analytics] Error details:", error.message)
    }
    return []
  }
}
