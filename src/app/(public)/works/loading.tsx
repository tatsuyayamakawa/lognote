import { Skeleton } from "@/components/ui/skeleton";

export default function WorksLoadingPage() {
  return (
    <section className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <div className="mb-8">
          <Skeleton className="h-5 w-48" />
        </div>

        {/* ページヘッダー */}
        <header className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-64" />
          <Skeleton className="mx-auto h-6 w-96" />
        </header>

        {/* 制作実績グリッド */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border bg-card">
              <Skeleton className="aspect-video w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
