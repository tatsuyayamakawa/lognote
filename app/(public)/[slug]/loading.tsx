import { Skeleton } from "@/components/ui/skeleton";
import { Profile } from "@/components/home/profile";

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
          <div className="mb-6 flex flex-wrap items-center justify-center gap-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      {/* 記事上広告（タイトル下） */}
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Skeleton className="h-[90px] w-[728px] rounded-lg" />
        </div>
      </div>

      {/* コンテンツセクション（max-w-7xl） */}
      <div className="mx-auto max-w-7xl pb-8 md:px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
          {/* メインコンテンツ */}
          <article className="min-w-0 md:bg-card md:rounded-lg md:border px-4 py-6 md:p-8 lg:p-12">
            {/* 記事本文、シェアボタン、関連記事はサーバーサイドで完全にレンダリングされるためスケルトン不要 */}
          </article>

          {/* 右サイドバー（PCのみ）*/}
          <aside className="hidden xl:block">
            <div className="sticky top-4 space-y-6">
              {/* プロフィール */}
              <Profile />

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
