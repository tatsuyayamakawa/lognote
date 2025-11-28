import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoadingPage() {
  return (
    <div className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* パンくずリスト */}
      <nav className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-24" />
      </nav>

      {/* カテゴリヘッダー */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <Skeleton className="mb-2 h-6 w-64" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* カテゴリフィルター */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Skeleton className="h-9 w-16 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
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
    </div>
  );
}
