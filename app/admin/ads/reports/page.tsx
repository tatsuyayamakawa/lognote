import { Suspense } from "react";
import { AdSenseRevenue, AdSenseRevenueSkeleton } from "@/app/admin/dashboard/adsense-revenue";
import { AdUnitRevenue } from "./ad-unit-revenue";
import {
  getAdSenseRevenue,
  getAdSenseSummary,
  getAdUnitRevenue,
} from "@/lib/google-adsense/adsense";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AdSenseレポート",
};

interface AdSenseReportsPageProps {
  searchParams: Promise<{ period?: string }>;
}

async function AdSenseReportsData({ period }: { period: string }) {
  const days = parseInt(period, 10);
  const [adsenseRevenue, adsenseSummary, adUnitRevenue] = await Promise.all([
    getAdSenseRevenue(days),
    getAdSenseSummary(days),
    getAdUnitRevenue(days),
  ]);

  if (adsenseRevenue.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AdSense連携</CardTitle>
          <CardDescription>
            AdSense収益データを表示するには、Googleアカウントで認証が必要です
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              以下のボタンをクリックして、GoogleアカウントでAdSenseへのアクセスを許可してください。
            </p>
            <Button asChild>
              <Link href="/api/auth/adsense">
                Google AdSenseと連携
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* AdSense Revenue Section */}
      <AdSenseRevenue
        revenueData={adsenseRevenue}
        summary={adsenseSummary}
        period={period}
      />

      {/* Ad Unit Revenue Section */}
      <AdUnitRevenue adUnitData={adUnitRevenue} period={period} />
    </div>
  );
}

export default async function AdSenseReportsPage({
  searchParams,
}: AdSenseReportsPageProps) {
  const { period = "30" } = await searchParams;

  // AdSenseが設定されているかチェック
  const adsenseConfigured =
    !!process.env.GOOGLE_ADSENSE_CLIENT_ID && !!process.env.GOOGLE_ADSENSE_CLIENT_SECRET;

  if (!adsenseConfigured) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">AdSenseレポート</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            広告収益とパフォーマンス統計
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AdSense連携設定</CardTitle>
            <CardDescription>
              AdSenseレポートを表示するには、Google AdSenseの設定が必要です
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
                    GOOGLE_ADSENSE_CLIENT_ID
                  </code>{" "}
                  - Google Cloud Console で作成したOAuth 2.0クライアントID
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">
                    GOOGLE_ADSENSE_CLIENT_SECRET
                  </code>{" "}
                  - OAuth 2.0クライアントシークレット
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">AdSenseレポート</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          広告収益とパフォーマンス統計
        </p>
      </div>

      <Suspense fallback={<AdSenseRevenueSkeleton currentPeriod={period} />}>
        <AdSenseReportsData period={period} />
      </Suspense>
    </div>
  );
}
