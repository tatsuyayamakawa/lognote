import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function PostsLoadingPage() {
  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">記事管理</h1>
          <Skeleton className="mt-1 h-4 w-48" />
        </div>
        <Button disabled className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>

      {/* フィルタリング */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled>
          すべて
        </Button>
        <Button variant="outline" size="sm" disabled>
          公開
        </Button>
        <Button variant="outline" size="sm" disabled>
          下書き
        </Button>
        <Button variant="outline" size="sm" disabled>
          非公開
        </Button>
      </div>

      {/* デスクトップ: テーブル表示 */}
      <Card className="hidden md:block pb-0">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="w-64 px-4 py-3 text-left text-sm font-medium">
                    タイトル
                  </th>
                  <th className="w-80 px-4 py-3 text-left text-sm font-medium">
                    抜粋
                  </th>
                  <th className="w-32 px-4 py-3 text-left text-sm font-medium">
                    カテゴリ
                  </th>
                  <th className="w-24 px-4 py-3 text-left text-sm font-medium">
                    ステータス
                  </th>
                  <th className="w-20 px-4 py-3 text-center text-sm font-medium">
                    特集
                  </th>
                  <th className="w-24 px-4 py-3 text-left text-sm font-medium">
                    閲覧数
                  </th>
                  <th className="w-24 px-4 py-3 text-left text-sm font-medium">
                    いいね数
                  </th>
                  <th className="w-36 px-4 py-3 text-left text-sm font-medium">
                    公開日
                  </th>
                  <th className="w-36 px-4 py-3 text-left text-sm font-medium">
                    更新日
                  </th>
                  <th className="w-32 px-4 py-3 text-left text-sm font-medium">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td className="w-64 px-4 py-3 h-16">
                      <Skeleton className="h-4 w-full" />
                    </td>
                    <td className="w-80 px-4 py-3 h-16">
                      <Skeleton className="h-4 w-full" />
                    </td>
                    <td className="px-4 py-3 h-16">
                      <Skeleton className="h-5 w-16" />
                    </td>
                    <td className="px-4 py-3 h-16">
                      <Skeleton className="h-6 w-12" />
                    </td>
                    <td className="px-4 py-3 h-16">
                      <div className="flex justify-center">
                        <Skeleton className="h-4 w-4" />
                      </div>
                    </td>
                    <td className="px-4 py-3 h-16">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-4 py-3 h-16">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-4 py-3 h-16">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3 h-16">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3 h-16">
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* モバイル: カード表示 */}
      <div className="space-y-4 md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-6 w-12 shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* カテゴリ */}
              <div className="flex gap-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>

              {/* メタ情報 */}
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>

              {/* 操作ボタン */}
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
