import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function AdsLoadingPage() {
  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">広告設定</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            各広告ユニットのスロットIDを設定します
          </p>
        </div>
      </div>

      {/* 広告設定カード（スケルトン） */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-64" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-96" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* 保存ボタン */}
        <div className="flex justify-end">
          <Button disabled size="lg">
            <Save className="mr-2 h-4 w-4" />
            設定を保存
          </Button>
        </div>
      </div>
    </div>
  );
}
