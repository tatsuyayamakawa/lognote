import { Skeleton } from "@/components/ui/skeleton";

export default function WorkDetailLoadingPage() {
  return (
    <article className="flex-1">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <div className="mb-6">
          <Skeleton className="h-5 w-64" />
        </div>

        {/* メインビジュアル */}
        <Skeleton className="mb-8 aspect-[1200/675] w-full rounded-lg" />

        {/* ヘッダー情報 */}
        <header className="mb-12">
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="mb-4 h-12 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </header>

        {/* 基本情報 */}
        <section className="mb-12">
          <div className="grid gap-6 rounded-lg border bg-card p-6 sm:grid-cols-2">
            <div>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
        </section>

        {/* 技術スタック */}
        <section className="mb-12">
          <Skeleton className="mb-4 h-8 w-32" />
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-lg" />
            ))}
          </div>
        </section>

        {/* 主な機能 */}
        <section className="mb-12">
          <Skeleton className="mb-4 h-8 w-32" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
