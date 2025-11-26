import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleLoadingPage() {
  return (
    <div className="flex-1">
      {/* パンくずリスト（max-w-7xl） */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-1" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-1" />
          <Skeleton className="h-4 w-full sm:w-48" />
        </div>
      </div>

      {/* ヘッダーセクション（タイトル・メタ情報 - max-w-4xl） */}
      <div className="mx-auto max-w-4xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          {/* カテゴリ */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>

          {/* タイトル（左揃え） */}
          <div className="mb-6 space-y-3 text-left">
            <Skeleton className="h-10 w-full md:h-12" />
            <Skeleton className="h-10 w-3/4 md:h-12" />
          </div>

          {/* メタ情報（中央揃え） */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* コンテンツセクション（max-w-7xl） */}
      <div className="mx-auto max-w-7xl pb-8 md:px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          {/* メインコンテンツ */}
          <article className="min-w-0 md:bg-card md:rounded-lg md:border px-4 py-6 md:p-8 lg:p-12">
            {/* 記事上広告 */}
            <div className="mb-10">
              <Skeleton className="h-[250px] w-full rounded-lg" />
            </div>

            {/* コンテンツ */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="py-4" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="py-4" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="py-8" />

              {/* 記事下広告 */}
              <Skeleton className="h-[280px] w-full rounded-lg" />

              {/* シェアボタン */}
              <div className="mt-12 border-t pt-8">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>

              {/* 関連記事 */}
              <div className="mt-12">
                <Skeleton className="mb-6 h-8 w-32" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg border">
                      <Skeleton className="aspect-video w-full" />
                      <div className="p-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="mt-2 h-5 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* 右サイドバー（PCのみ）*/}
          <aside className="hidden xl:block">
            <div className="sticky top-4 space-y-6">
              {/* プロフィール */}
              <div className="rounded-lg border bg-card p-6">
                <Skeleton className="mx-auto h-24 w-24 rounded-full" />
                <Skeleton className="mx-auto mt-4 h-6 w-32" />
                <Skeleton className="mx-auto mt-2 h-4 w-full" />
                <Skeleton className="mx-auto mt-1 h-4 w-5/6" />
              </div>

              {/* 目次 */}
              <div className="rounded-lg border bg-card p-5">
                <Skeleton className="mb-4 h-6 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5 pl-4" />
                  <Skeleton className="h-4 w-5/6 pl-4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
