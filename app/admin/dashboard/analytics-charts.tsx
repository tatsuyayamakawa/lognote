"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface PageViewData {
  date: string;
  views: number;
}

interface TopPage {
  title: string;
  path: string;
  views: number;
}

interface OrganicSearchStat {
  date: string;
  sessions: number;
  engagedSessions: number;
  avgDuration: number;
}

interface SearchKeyword {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface AnalyticsChartsProps {
  pageViews: PageViewData[];
  topPages: TopPage[];
  organicSearchStats: OrganicSearchStat[];
  searchKeywords: SearchKeyword[];
}

export function AnalyticsCharts({
  pageViews,
  topPages,
  organicSearchStats,
  searchKeywords,
}: AnalyticsChartsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get("period") || "30";
  const [isPending, startTransition] = useTransition();

  const handlePeriodChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const chartConfig = {
    views: {
      label: "ページビュー",
      color: "hsl(207, 89%, 68%)", // Sky Blue
    },
    sessions: {
      label: "セッション",
      color: "hsl(174, 42%, 65%)", // Aqua Green
    },
    engagedSessions: {
      label: "エンゲージメントセッション",
      color: "hsl(122, 37%, 74%)", // Green
    },
  };

  const getPeriodLabel = () => {
    switch (currentPeriod) {
      case "7":
        return "過去7日間";
      case "14":
        return "過去14日間";
      case "30":
        return "過去30日間";
      case "90":
        return "過去90日間";
      default:
        return "過去30日間";
    }
  };

  // Format date for display (YYYYMMDD -> MM/DD)
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${month}/${day}`;
  };

  // Sort data by date in ascending order (oldest to newest)
  const formattedPageViews = pageViews
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      ...item,
      dateFormatted: formatDate(item.date),
    }));

  const formattedOrganicStats = organicSearchStats
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      ...item,
      dateFormatted: formatDate(item.date),
    }));

  // Calculate appropriate tick interval for X-axis
  const getTickInterval = (dataLength: number) => {
    if (dataLength <= 7) return 0; // Show all ticks
    if (dataLength <= 14) return 1; // Show every other tick
    if (dataLength <= 30) return Math.floor(dataLength / 7); // Show ~7 ticks
    return Math.floor(dataLength / 10); // Show ~10 ticks for longer periods
  };

  const pageViewsTickInterval = getTickInterval(formattedPageViews.length);
  const organicStatsTickInterval = getTickInterval(
    formattedOrganicStats.length
  );

  if (isPending) {
    return <AnalyticsChartsSkeleton currentPeriod={currentPeriod} />;
  }

  return (
    <div className="space-y-6">
      {/* 期間選択 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">アナリティクス</h2>
          <p className="text-sm text-muted-foreground">
            {getPeriodLabel()}のデータ
          </p>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="linear"
                  dataKey="views"
                  stroke="var(--color-views)"
                  strokeWidth={2}
                  fill="var(--color-views)"
                  fillOpacity={0.2}
                  dot={false}
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
          <CardDescription>
            {getPeriodLabel()}のGoogle検索からの流入推移
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organicSearchStats.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={formattedOrganicStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="linear"
                  dataKey="sessions"
                  stroke="var(--color-sessions)"
                  strokeWidth={2}
                  fill="var(--color-sessions)"
                  fillOpacity={0.2}
                  dot={false}
                />
                <Area
                  type="linear"
                  dataKey="engagedSessions"
                  stroke="var(--color-engagedSessions)"
                  strokeWidth={2}
                  fill="var(--color-engagedSessions)"
                  fillOpacity={0.2}
                  dot={false}
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

      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* 人気ページ */}
        <Card>
          <CardHeader>
            <CardTitle>人気ページ</CardTitle>
            <CardDescription>最も閲覧されているページ</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {topPages.length > 0 ? (
              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 pb-3 border-b last:border-0 last:pb-0 min-w-0"
                  >
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-medium text-sm truncate">
                        {page.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {page.path}
                      </p>
                    </div>
                    <div className="shrink-0 text-right whitespace-nowrap">
                      <p className="font-bold text-sm">
                        {page.views.toLocaleString()}
                      </p>
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
          <CardContent className="overflow-x-auto">
            {searchKeywords.length > 0 ? (
              <div className="space-y-3">
                {searchKeywords.slice(0, 10).map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 pb-3 border-b last:border-0 last:pb-0 min-w-0"
                  >
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className="font-medium text-sm wrap-break-words">
                        {keyword.query}
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                        平均掲載順位: {keyword.position.toFixed(1)}位 • CTR:{" "}
                        {(keyword.ctr * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="shrink-0 text-right whitespace-nowrap">
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
  );
}

function AnalyticsChartsSkeleton({ currentPeriod }: { currentPeriod: string }) {
  const getPeriodLabel = () => {
    switch (currentPeriod) {
      case "7":
        return "過去7日間";
      case "14":
        return "過去14日間";
      case "30":
        return "過去30日間";
      case "90":
        return "過去90日間";
      default:
        return "過去30日間";
    }
  };

  return (
    <div className="space-y-6">
      {/* 期間選択 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">アナリティクス</h2>
          <p className="text-sm text-muted-foreground">
            {getPeriodLabel()}のデータ
          </p>
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {/* ページビューグラフ */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      {/* オーガニック検索統計 */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* 人気ページ */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-48" />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 pb-3 border-b last:border-0 last:pb-0 min-w-0"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                    <Skeleton className="h-3 w-3/4 max-w-[150px]" />
                  </div>
                  <div className="shrink-0 space-y-2 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                    <Skeleton className="h-3 w-12 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 流入キーワード */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-56" />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 pb-3 border-b last:border-0 last:pb-0 min-w-0"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                    <Skeleton className="h-3 w-2/3 max-w-[150px]" />
                  </div>
                  <div className="shrink-0 space-y-2 text-right">
                    <Skeleton className="h-4 w-12 ml-auto" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
