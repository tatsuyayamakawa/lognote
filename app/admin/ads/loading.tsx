import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Monitor, Smartphone } from "lucide-react";

export default function AdsLoadingPage() {
  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">広告レイアウト</h1>
          <p className="text-muted-foreground">
            レイアウトを見ながら広告を配置できます
          </p>
        </div>
        <Button disabled size="lg">
          <Save className="mr-2 h-4 w-4" />
          保存
        </Button>
      </div>

      {/* デバイス切り替えタブ */}
      <Tabs value="pc">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pc" className="flex items-center gap-2" disabled>
            <Monitor className="h-4 w-4" />
            PC表示
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2" disabled>
            <Smartphone className="h-4 w-4" />
            スマホ表示
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 広告設定カード（スケルトン） */}
      <div className="mt-6 space-y-6">
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
      </div>
    </div>
  );
}
