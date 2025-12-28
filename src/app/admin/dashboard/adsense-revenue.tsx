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

interface AdSenseRevenueData {
  date: string;
  earnings: number;
  clicks: number;
  impressions: number;
  ctr: number;
  rpm: number;
}

interface AdSenseSummary {
  totalEarnings: number;
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averageRpm: number;
}

interface AdSenseRevenueProps {
  revenueData: AdSenseRevenueData[];
  summary: AdSenseSummary | null;
}

export function AdSenseRevenue({
  revenueData,
  summary,
}: AdSenseRevenueProps) {
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
    earnings: {
      label: "収益",
      color: "hsl(142, 76%, 36%)", // Green
    },
    impressions: {
      label: "表示回数",
      color: "hsl(221, 83%, 53%)", // Blue
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

  // Format currency in Japanese Yen
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString("ja-JP");
  };

  // Format data for chart
  const formattedData = revenueData.map((item) => ({
    ...item,
    dateFormatted: formatDate(item.date),
    // Scale impressions for better chart visibility (divide by 100)
    impressionsScaled: item.impressions / 100,
  }));

  // Calculate tick interval
  const getTickInterval = (dataLength: number) => {
    if (dataLength <= 7) return 0;
    if (dataLength <= 14) return 1;
    if (dataLength <= 30) return Math.floor(dataLength / 7);
    return Math.floor(dataLength / 10);
  };

  const tickInterval = getTickInterval(formattedData.length);

  if (isPending) {
    return <AdSenseRevenueSkeleton currentPeriod={currentPeriod} />;
  }

  return (
    <div className="space-y-6">
      {/* 期間選択 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">AdSense収益</h2>
          <p className="text-sm text-muted-foreground">
            {getPeriodLabel()}のデータ
          </p>
        </div>
        <Select value={currentPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>合計収益</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.totalEarnings)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>合計クリック数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(summary.totalClicks)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>合計表示回数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(summary.totalImpressions)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>平均CTR / RPM</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.averageCtr.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                RPM: {formatCurrency(summary.averageRpm)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>収益推移</CardTitle>
          <CardDescription>{getPeriodLabel()}の収益データ</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="dateFormatted"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={tickInterval}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        if (name === "earnings") {
                          return formatCurrency(value as number);
                        }
                        if (name === "impressionsScaled") {
                          return formatNumber((value as number) * 100);
                        }
                        return value;
                      }}
                      labelFormatter={(label) => `日付: ${label}`}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="linear"
                  dataKey="earnings"
                  stroke="var(--color-earnings)"
                  strokeWidth={2}
                  fill="var(--color-earnings)"
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>クリック率（CTR）推移</CardTitle>
            <CardDescription>
              {getPeriodLabel()}のクリック率データ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <div className="space-y-3">
                {revenueData.slice(-10).map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {formatDate(data.date)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        クリック: {formatNumber(data.clicks)} / 表示:{" "}
                        {formatNumber(data.impressions)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{data.ctr.toFixed(2)}%</p>
                      <p className="text-xs text-muted-foreground">CTR</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  データがありません
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RPM推移</CardTitle>
            <CardDescription>
              {getPeriodLabel()}の1000インプレッション単価
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueData.length > 0 ? (
              <div className="space-y-3">
                {revenueData.slice(-10).map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {formatDate(data.date)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        収益: {formatCurrency(data.earnings)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">
                        {formatCurrency(data.rpm)}
                      </p>
                      <p className="text-xs text-muted-foreground">RPM</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  データがありません
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function AdSenseRevenueSkeleton({ currentPeriod }: { currentPeriod: string }) {
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">AdSense収益</h2>
          <p className="text-sm text-muted-foreground">
            {getPeriodLabel()}のデータ
          </p>
        </div>
        <Skeleton className="h-10 w-full sm:w-[180px]" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              {index === 3 && <Skeleton className="mt-2 h-3 w-24" />}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      {/* Performance Metrics Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, cardIndex) => (
          <Card key={cardIndex}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-2 h-4 w-56" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="space-y-2 text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                      <Skeleton className="h-3 w-12 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
