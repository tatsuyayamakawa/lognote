import { Suspense } from "react";
import { AdSenseRevenue, AdSenseRevenueSkeleton } from "./adsense-revenue";
import {
  getAdSenseRevenue,
  getAdSenseSummary,
} from "@/lib/google-adsense/adsense";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AdSenseSectionProps {
  period: string;
}

async function AdSenseData({ period }: AdSenseSectionProps) {
  const days = parseInt(period, 10);
  const adsenseRevenue = await getAdSenseRevenue(days);
  const adsenseSummary = await getAdSenseSummary(days);

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
    <AdSenseRevenue
      revenueData={adsenseRevenue}
      summary={adsenseSummary}
      period={period}
    />
  );
}

export function AdSenseSection({ period }: AdSenseSectionProps) {
  return (
    <Suspense fallback={<AdSenseRevenueSkeleton currentPeriod={period} />}>
      <AdSenseData period={period} />
    </Suspense>
  );
}
