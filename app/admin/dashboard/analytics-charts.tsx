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

interface SearchQuery {
  source: string
  medium: string
  referrer: string
  sessions: number
  engagedSessions: number
}

interface OrganicSearchStat {
  date: string
  sessions: number
  engagedSessions: number
  avgDuration: number
}

interface AnalyticsChartsProps {
  pageViews: PageViewData[]
  topPages: TopPage[]
  searchQueries: SearchQuery[]
  organicSearchStats: OrganicSearchStat[]
}

export function AnalyticsCharts({
  pageViews,
  topPages,
  searchQueries,
  organicSearchStats,
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

  const formattedPageViews = pageViews.map((item) => ({
    ...item,
    dateFormatted: formatDate(item.date),
  }))

  const formattedOrganicStats = organicSearchStats.map((item) => ({
    ...item,
    dateFormatted: formatDate(item.date),
  }))

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
            <p className="text-sm text-muted-foreground py-8 text-center">
              データがありません
            </p>
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
            <p className="text-sm text-muted-foreground py-8 text-center">
              データがありません
            </p>
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
              <p className="text-sm text-muted-foreground py-8 text-center">
                データがありません
              </p>
            )}
          </CardContent>
        </Card>

        {/* 検索クエリ */}
        <Card>
          <CardHeader>
            <CardTitle>検索トラフィック</CardTitle>
            <CardDescription>Google検索からの流入</CardDescription>
          </CardHeader>
          <CardContent>
            {searchQueries.length > 0 ? (
              <div className="space-y-3">
                {searchQueries.slice(0, 10).map((query, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        {query.source} / {query.medium}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {query.referrer}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-sm">
                        {query.sessions.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        エンゲージ: {query.engagedSessions}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">
                データがありません
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
