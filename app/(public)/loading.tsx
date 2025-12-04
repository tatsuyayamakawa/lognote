import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoadingPage() {
  return (
    <div className="flex-1">
      {/* ヒーローセクション */}
      <div className="relative h-[50vh] w-full xl:h-[70vh]">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 特集記事セクション */}
        <div className="mb-16">
          <Skeleton className="mb-8 h-10 w-48" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
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

        {/* 最新記事セクション */}
        <div>
          <Skeleton className="mb-8 h-10 w-48" />
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
      </div>
    </div>
  );
}
