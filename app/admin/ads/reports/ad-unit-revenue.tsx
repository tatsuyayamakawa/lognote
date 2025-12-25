"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdUnitRevenueData {
  adUnitId: string;
  adUnitName: string;
  earnings: number;
  clicks: number;
  impressions: number;
  ctr: number;
  rpm: number;
}

interface AdUnitRevenueProps {
  adUnitData: AdUnitRevenueData[];
  period: string;
}

export function AdUnitRevenue({ adUnitData, period }: AdUnitRevenueProps) {
  const getPeriodLabel = () => {
    switch (period) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>広告ユニット別収益</CardTitle>
        <CardDescription>
          {getPeriodLabel()}の広告ユニットごとのパフォーマンス
        </CardDescription>
      </CardHeader>
      <CardContent>
        {adUnitData.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">広告ユニット名</TableHead>
                  <TableHead className="text-right font-semibold">収益</TableHead>
                  <TableHead className="text-right font-semibold">
                    クリック数
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    表示回数
                  </TableHead>
                  <TableHead className="text-right font-semibold">CTR</TableHead>
                  <TableHead className="text-right font-semibold">RPM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adUnitData.map((unit, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{unit.adUnitName}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {unit.adUnitId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(unit.earnings)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(unit.clicks)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(unit.impressions)}
                    </TableCell>
                    <TableCell className="text-right">
                      {unit.ctr.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(unit.rpm)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
  );
}
