"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface PageViewData {
  date: string
  views: number
}

interface TopPage {
  title: string
  path: string
  views: number
}

interface OrganicSearchStat {
  date: string
  sessions: number
  engagedSessions: number
  avgDuration: number
}

interface SearchKeyword {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface AnalyticsChartsProps {
  pageViews: PageViewData[]
  topPages: TopPage[]
  organicSearchStats: OrganicSearchStat[]
  searchKeywords: SearchKeyword[]
}

export function AnalyticsCharts({
  pageViews,
  topPages,
  organicSearchStats,
  searchKeywords,
}: AnalyticsChartsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPeriod = searchParams.get("period") || "30"

  const handlePeriodChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("period", value)
    router.push(`?${params.toString()}`)
  }

  const chartConfig = {
    views: {
      label: "ページビュー",
      color: "hsl(var(--chart-1))",
    },
    sessions: {
      label: "セッション",
      color: "hsl(var(--chart-2))",
    },
    engagedSessions: {
      label: "エンゲージメントセッション",
      color: "hsl(var(--chart-3))",
    },
  }

  const getPeriodLabel = () => {
    switch (currentPeriod) {
      case "7":
        return "過去7日間"
      case "14":
        return "過去14日間"
      case "30":
        return "過去30日間"
      case "90":
        return "過去90日間"
      default:
        return "過去30日間"
    }
  }

  // Format date for display (YYYYMMDD -> MM/DD)
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) return dateStr
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    return `${month}/${day}`
  }

  // Sort data by date in ascending order (oldest to newest)
  const formattedPageViews = pageViews
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      ...item,
      dateFormatted: formatDate(item.date),
    }))

  const formattedOrganicStats = organicSearchStats
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      ...item,
      dateFormatted: formatDate(item.date),
    }))

  // Calculate appropriate tick interval for X-axis
  const getTickInterval = (dataLength: number) => {
    if (dataLength <= 7) return 0 // Show all ticks
    if (dataLength <= 14) return 1 // Show every other tick
    if (dataLength <= 30) return Math.floor(dataLength / 7) // Show ~7 ticks
    return Math.floor(dataLength / 10) // Show ~10 ticks for longer periods
  }

  const pageViewsTickInterval = getTickInterval(formattedPageViews.length)
  const organicStatsTickInterval = getTickInterval(formattedOrganicStats.length)

  return (
    <div className="space-y-6">
      {/* 期間選択 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">アナリティクス</h2>
          <p className="text-sm text-muted-foreground">{getPeriodLabel()}のデータ</p>
        </div>
        <Select value={currentPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="期間を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">過去7日間</SelectItem>
            <SelectItem value="14">過去14日間</SelectItem>
            <SelectItem value="30">過去30日間</SelectItem>
            <SelectItem value="90">過去90日間</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ページビューグラフ */}
      <Card>
        <CardHeader>
          <CardTitle>ページビュー推移</CardTitle>
          <CardDescription>{getPeriodLabel()}のページビュー数</CardDescription>
        </CardHeader>
        <CardContent>
          {pageViews.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={formattedPageViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="dateFormatted"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={pageViewsTickInterval}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-views)"
                  fill="var(--color-views)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                データがありません
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Google Analytics 4の設定が必要です。
                <br />
                詳しくは
                <a
                  href="https://github.com/tatsuyayamakawa/lognote#google-analytics--search-console連携設定"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200"
                >
                  README
                </a>
                をご確認ください
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* オーガニック検索統計 */}
      <Card>
        <CardHeader>
          <CardTitle>オーガニック検索統計</CardTitle>
          <CardDescription>{getPeriodLabel()}のGoogle検索からの流入推移</CardDescription>
        </CardHeader>
        <CardContent>
          {organicSearchStats.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={formattedOrganicStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="dateFormatted"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={organicStatsTickInterval}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--color-sessions)"
                  fill="var(--color-sessions)"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="engagedSessions"
                  stroke="var(--color-engagedSessions)"
                  fill="var(--color-engagedSessions)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                データがありません
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Google Analytics 4の設定が必要です。
                <br />
                詳しくは
                <a
                  href="https://github.com/tatsuyayamakawa/lognote#google-analytics--search-console連携設定"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200"
                >
                  README
                </a>
                をご確認ください
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 人気ページ */}
        <Card>
          <CardHeader>
            <CardTitle>人気ページ</CardTitle>
            <CardDescription>最も閲覧されているページ</CardDescription>
          </CardHeader>
          <CardContent>
            {topPages.length > 0 ? (
              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{page.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {page.path}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-sm">{page.views.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  データがありません
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Google Analytics 4の設定が必要です。
                  <br />
                  詳しくは
                  <a
                    href="https://github.com/tatsuyayamakawa/lognote#google-analytics--search-console連携設定"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    README
                  </a>
                  をご確認ください
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 流入キーワード */}
        <Card>
          <CardHeader>
            <CardTitle>流入キーワード</CardTitle>
            <CardDescription>検索エンジンからの流入キーワード</CardDescription>
          </CardHeader>
          <CardContent>
            {searchKeywords.length > 0 ? (
              <div className="space-y-3">
                {searchKeywords.slice(0, 10).map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm wrap-break-word">
                        {keyword.query}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        平均掲載順位: {keyword.position.toFixed(1)}位 • CTR: {(keyword.ctr * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-sm">
                        {keyword.clicks.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        表示: {keyword.impressions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  データがありません
                </p>
                {searchKeywords.length === 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Search Console APIの設定が必要です。
                    <br />
                    詳しくは
                    <a
                      href="https://github.com/tatsuyayamakawa/lognote#google-analytics--search-console連携設定"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      README
                    </a>
                    をご確認ください
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
