import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostsTableSkeleton() {
  return (
    <>
      {/* デスクトップ: テーブル表示 */}
      <Card className="hidden xl:block pb-0">
        <CardHeader className="pb-3">
          <CardTitle>記事一覧</CardTitle>
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

      {/* モバイル・タブレット: カード表示 */}
      <div className="space-y-2 xl:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="overflow-hidden py-0">
            <div className="flex">
              {/* 左側: ステータスインジケーター */}
              <div className="w-1 shrink-0 bg-muted" />

              {/* 右側: コンテンツ */}
              <div className="flex-1 px-3 py-2.5">
                {/* ヘッダー: タイトル + バッジ */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  <Skeleton className="h-4 w-10 shrink-0 rounded" />
                </div>

                {/* 中段: カテゴリ + メタ情報 */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mb-2">
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-12 rounded" />
                    <Skeleton className="h-4 w-14 rounded" />
                  </div>
                  <span className="text-muted-foreground/30">|</span>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <span className="text-muted-foreground/30">|</span>
                  <Skeleton className="h-3 w-20" />
                </div>

                {/* フッター: 操作ボタン */}
                <div className="flex items-center gap-0.5 -ml-1.5">
                  <Skeleton className="h-7 w-12 rounded" />
                  <Skeleton className="h-7 w-12 rounded" />
                  <Skeleton className="h-7 w-12 rounded" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
