import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoadingPage() {
  return (
    <div className="flex-1 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* パンくずリスト */}
      <nav className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1">
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
        <Skeleton className="mb-2 h-6 w-full max-w-md" />
        <Skeleton className="h-5 w-32" />
      </div>

      {/* カテゴリフィルター */}
      <div className="mb-8 flex flex-wrap gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      {/* 記事一覧 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="overflow-hidden rounded-lg border bg-card">
            <Skeleton className="aspect-video w-full" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
