import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsLoadingPage() {
  return (
    <div className="space-y-8">
      {/* ページヘッダー */}
      <div>
        <Skeleton className="h-8 w-48 sm:h-9 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* AdSense Revenue Skeleton */}
      <div className="space-y-6">
        {/* 期間選択 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-full sm:w-[180px]" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                {index === 3 && <Skeleton className="mt-2 h-3 w-24" />}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue Chart Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        {/* Performance Metrics Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, cardIndex) => (
            <Card key={cardIndex}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="mt-2 h-4 w-56" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-3 pb-3 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <div className="space-y-2 text-right">
                        <Skeleton className="h-4 w-16 ml-auto" />
                        <Skeleton className="h-3 w-12 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ad Unit Revenue Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
