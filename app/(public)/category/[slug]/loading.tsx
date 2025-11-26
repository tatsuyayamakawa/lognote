import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoadingPage() {
  return (
    <div className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* メインカラム */}
        <main>
          {/* カテゴリヘッダー */}
          <div className="mb-8">
            <Skeleton className="mb-2 h-10 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>

          {/* 記事グリッド */}
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border bg-card"
              >
                {/* サムネイル */}
                <Skeleton className="aspect-video w-full" />

                <div className="p-6">
                  {/* カテゴリ */}
                  <Skeleton className="mb-3 h-6 w-20" />

                  {/* タイトル */}
                  <Skeleton className="mb-2 h-6 w-full" />
                  <Skeleton className="mb-4 h-6 w-3/4" />

                  {/* 抜粋 */}
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="mb-4 h-4 w-2/3" />

                  {/* メタ情報 */}
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* サイドバー */}
        <aside className="space-y-6">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </aside>
      </div>
    </div>
  );
}
