import { BetaAnalyticsDataClient } from "@google-analytics/data"

let analyticsDataClient: BetaAnalyticsDataClient | null = null

export function getAnalyticsClient() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn("Google Analytics credentials not configured")
    return null
  }

  if (!analyticsDataClient) {
    analyticsDataClient = new BetaAnalyticsDataClient()
  }

  return analyticsDataClient
}

export async function getPageViews(days: number = 30) {
  const client = getAnalyticsClient()
  if (!client || !process.env.GA4_PROPERTY_ID) {
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

    return (
      response.rows?.map((row) => ({
        date: row.dimensionValues?.[0]?.value || "",
        views: parseInt(row.metricValues?.[0]?.value || "0"),
      })) || []
    )
  } catch (error) {
    console.error("Error fetching page views:", error)
    return []
  }
}

export async function getTopPages(limit: number = 10) {
  const client = getAnalyticsClient()
  if (!client || !process.env.GA4_PROPERTY_ID) {
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

    return (
      response.rows?.map((row) => ({
        title: row.dimensionValues?.[0]?.value || "",
        path: row.dimensionValues?.[1]?.value || "",
        views: parseInt(row.metricValues?.[0]?.value || "0"),
      })) || []
    )
  } catch (error) {
    console.error("Error fetching top pages:", error)
    return []
  }
}

export async function getSearchQueries(limit: number = 20) {
  const client = getAnalyticsClient()
  if (!client || !process.env.GA4_PROPERTY_ID) {
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

    return (
      response.rows?.map((row) => ({
        source: row.dimensionValues?.[0]?.value || "",
        medium: row.dimensionValues?.[1]?.value || "",
        referrer: row.dimensionValues?.[2]?.value || "",
        sessions: parseInt(row.metricValues?.[0]?.value || "0"),
        engagedSessions: parseInt(row.metricValues?.[1]?.value || "0"),
      })) || []
    )
  } catch (error) {
    console.error("Error fetching search queries:", error)
    return []
  }
}

export async function getOrganicSearchStats(days: number = 30) {
  const client = getAnalyticsClient()
  if (!client || !process.env.GA4_PROPERTY_ID) {
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

    return (
      response.rows?.map((row) => ({
        date: row.dimensionValues?.[0]?.value || "",
        sessions: parseInt(row.metricValues?.[0]?.value || "0"),
        engagedSessions: parseInt(row.metricValues?.[1]?.value || "0"),
        avgDuration: parseFloat(row.metricValues?.[2]?.value || "0"),
      })) || []
    )
  } catch (error) {
    console.error("Error fetching organic search stats:", error)
    return []
  }
}
