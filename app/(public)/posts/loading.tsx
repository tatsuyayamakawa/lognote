import { Skeleton } from "@/components/ui/skeleton";

export default function PostsLoadingPage() {
  return (
    <div className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ページタイトルと説明 */}
      <div className="mb-8">
        <Skeleton className="mb-4 h-9 w-48" />
        <Skeleton className="h-5 w-32" />
      </div>

      {/* カテゴリフィルター */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Skeleton className="h-9 w-16 rounded-full" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      {/* 記事グリッド */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border bg-card"
          >
            {/* サムネイル */}
            <Skeleton className="aspect-video w-full" />

            <div className="p-6">
              {/* カテゴリ */}
              <div className="mb-3 flex flex-wrap gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

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
    </div>
  );
}
