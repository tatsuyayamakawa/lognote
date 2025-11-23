import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, FolderOpen, Eye, Plus } from "lucide-react";
import {
  getPageViews,
  getTopPages,
  getSearchQueries,
  getOrganicSearchStats,
} from "@/lib/google-analytics/analytics";
import { AnalyticsCharts } from "./analytics-charts";

async function getStats() {
  const supabase = await createClient();

  // 記事数を取得
  const { count: totalPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  const { count: publishedPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: draftPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");

  // カテゴリ数を取得
  const { count: totalCategories } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  // 総閲覧数を取得
  const { data: posts } = await supabase.from("posts").select("view_count");
  const totalViews =
    posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

  return {
    totalPosts: totalPosts || 0,
    publishedPosts: publishedPosts || 0,
    draftPosts: draftPosts || 0,
    totalCategories: totalCategories || 0,
    totalViews,
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "30" } = await searchParams;
  const days = parseInt(period, 10);

  const stats = await getStats();
  const gaConfigured =
    !!process.env.GA4_PROPERTY_ID &&
    !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

  // Fetch analytics data with selected period
  const pageViews = gaConfigured ? await getPageViews(days) : [];
  const topPages = gaConfigured ? await getTopPages(10) : [];
  const searchQueries = gaConfigured ? await getSearchQueries(20) : [];
  const organicSearchStats = gaConfigured
    ? await getOrganicSearchStats(days)
    : [];

  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
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

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総記事数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              公開: {stats.publishedPosts} / 下書き: {stats.draftPosts}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">カテゴリ数</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">アクティブ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総閲覧数</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">全記事合計</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics連携</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                gaConfigured ? "text-green-600" : ""
              }`}
            >
              {gaConfigured ? "設定済み" : "未設定"}
            </div>
            <p className="text-xs text-muted-foreground">
              {gaConfigured
                ? "Google Analytics連携中"
                : "GA4を設定してください"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics グラフセクション */}
      {gaConfigured ? (
        <AnalyticsCharts
          pageViews={pageViews}
          topPages={topPages}
          searchQueries={searchQueries}
          organicSearchStats={organicSearchStats}
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
