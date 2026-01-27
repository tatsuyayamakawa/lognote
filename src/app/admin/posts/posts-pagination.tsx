import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PostsPaginationProps {
  currentPage: number;
  totalPages: number;
  currentStatus?: string;
}

export function PostsPagination({
  currentPage,
  totalPages,
  currentStatus = "all",
}: PostsPaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (currentStatus !== "all") {
      params.set("status", currentStatus);
    }
    return `?${params.toString()}`;
  };

  // ページ番号の配列を生成（最大7個表示）
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // 7ページ以下なら全て表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 現在のページ周辺のみ表示
      if (currentPage <= 3) {
        // 最初の方
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 最後の方
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 真ん中
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent className="flex-wrap justify-center gap-1">
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious
              href={createPageUrl(currentPage - 1)}
              size="default"
              className="h-9 px-3 sm:px-4"
            />
          ) : (
            <span className="flex items-center gap-1 pl-2.5 h-9 px-3 sm:px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed">
              <span>前へ</span>
            </span>
          )}
        </PaginationItem>

        {/* モバイル: 現在のページ番号のみ表示 */}
        <PaginationItem className="sm:hidden">
          <span className="inline-flex h-9 items-center justify-center px-3 text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
        </PaginationItem>

        {/* デスクトップ: 全ページ番号表示 */}
        {getPageNumbers().map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`} className="hidden sm:block">
              <PaginationEllipsis />
            </PaginationItem>
          ) : page === currentPage ? (
            <PaginationItem key={page} className="hidden sm:block">
              <span
                aria-current="page"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium cursor-not-allowed"
              >
                {page}
              </span>
            </PaginationItem>
          ) : (
            <PaginationItem key={page} className="hidden sm:block">
              <PaginationLink href={createPageUrl(page)} size="icon">
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext
              href={createPageUrl(currentPage + 1)}
              size="default"
              className="h-9 px-3 sm:px-4"
            />
          ) : (
            <span className="flex items-center gap-1 pr-2.5 h-9 px-3 sm:px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed">
              <span>次へ</span>
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
