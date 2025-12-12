import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  getPageViews,
  getTopPages,
  getOrganicSearchStats,
} from "@/lib/google-analytics/analytics";
import { getSearchKeywords } from "@/lib/google-analytics/search-console";
import { AnalyticsCharts } from "./analytics-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSearchConsoleURL } from "@/lib/utils";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "30" } = await searchParams;
  const days = parseInt(period, 10);

  const gaConfigured =
    !!process.env.GA4_PROPERTY_ID &&
    (!!process.env.GOOGLE_SERVICE_ACCOUNT_JSON || !!process.env.GOOGLE_APPLICATION_CREDENTIALS);

  // サイトのURLを取得（Search Consoleのプロパティタイプに対応）
  const searchConsoleUrl = getSearchConsoleURL();

  // Fetch analytics data with selected period
  const pageViews = gaConfigured ? await getPageViews(days) : [];
  const topPages = gaConfigured ? await getTopPages(10, days) : [];
  const organicSearchStats = gaConfigured
    ? await getOrganicSearchStats(days)
    : [];

  // Fetch Search Console keywords
  const searchKeywords = gaConfigured
    ? await getSearchKeywords(searchConsoleUrl, days, 20)
    : [];

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold sm:text-3xl">ダッシュボード</h1>
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
          organicSearchStats={organicSearchStats}
          searchKeywords={searchKeywords}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>アナリティクス連携</CardTitle>
            <CardDescription>
              リアルタイムアナリティクスを表示するには、Google Analytics 4とGoogle Search Consoleの設定が必要です
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
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  📖 詳しい設定方法
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Google Analytics / Search Consoleの連携設定については、
                  <a
                    href="https://github.com/tatsuyayamakawa/lognote#google-analytics--search-console連携設定"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    README
                  </a>
                  をご確認ください。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
