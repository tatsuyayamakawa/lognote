import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  getPageViews,
  getTopPages,
  getSearchQueries,
  getOrganicSearchStats,
} from "@/lib/google-analytics/analytics";
import { getSearchKeywords } from "@/lib/google-analytics/search-console";
import { AnalyticsCharts } from "./analytics-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBaseURL } from "@/lib/utils";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "30" } = await searchParams;
  const days = parseInt(period, 10);

  const gaConfigured =
    !!process.env.GA4_PROPERTY_ID &&
    !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

  // サイトのURLを取得
  const searchConsoleUrl = getBaseURL();

  console.log("[Dashboard] GA4 configured:", gaConfigured);
  console.log("[Dashboard] Site URL:", searchConsoleUrl);
  console.log("[Dashboard] GA4_PROPERTY_ID:", process.env.GA4_PROPERTY_ID);
  console.log("[Dashboard] GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log("[Dashboard] Fetching analytics data for period:", days, "days");

  // Fetch analytics data with selected period
  const pageViews = gaConfigured ? await getPageViews(days) : [];
  const topPages = gaConfigured ? await getTopPages(10) : [];
  const searchQueries = gaConfigured ? await getSearchQueries(20) : [];
  const organicSearchStats = gaConfigured
    ? await getOrganicSearchStats(days)
    : [];

  // Fetch Search Console keywords
  const searchKeywords = gaConfigured
    ? await getSearchKeywords(searchConsoleUrl, days, 20)
    : [];

  console.log("[Dashboard] Analytics data fetched:");
  console.log("  - pageViews:", pageViews.length, "items");
  console.log("  - topPages:", topPages.length, "items");
  console.log("  - searchQueries:", searchQueries.length, "items");
  console.log("  - organicSearchStats:", organicSearchStats.length, "items");
  console.log("  - searchKeywords:", searchKeywords.length, "items");

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">ダッシュボード</h1>
            {gaConfigured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                GA4連携中
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">
            ブログの統計情報と最近の活動
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            新規記事作成
          </Link>
        </Button>
      </div>

      {/* Analytics グラフセクション */}
      {gaConfigured ? (
        <AnalyticsCharts
          pageViews={pageViews}
          topPages={topPages}
          searchQueries={searchQueries}
          organicSearchStats={organicSearchStats}
          searchKeywords={searchKeywords}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Google Analytics連携</CardTitle>
            <CardDescription>
              リアルタイムアナリティクスを表示するには、Google Analytics
              4を設定してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                以下の環境変数を設定してください：
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">
                    GA4_PROPERTY_ID
                  </code>{" "}
                  - Google Analytics 4のプロパティID
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">
                    GOOGLE_APPLICATION_CREDENTIALS
                  </code>{" "}
                  - サービスアカウントの認証情報ファイルパス
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
