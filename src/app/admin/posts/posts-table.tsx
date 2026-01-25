"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDate } from "@/lib/utils";
import type { PostWithCategories } from "@/types";
import { Eye, Edit, Trash2, Star, ThumbsUp } from "lucide-react";

interface PostsTableProps {
  posts: PostWithCategories[];
  currentPage: number;
  totalPages: number;
  currentStatus: string;
}

export function PostsTable({
  posts,
  currentPage,
  totalPages,
  currentStatus,
}: PostsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PostWithCategories | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const createStatusUrl = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    params.delete("page"); // ステータス変更時はページをリセット
    return `?${params.toString()}`;
  };

  const handleDeleteClick = (post: PostWithCategories) => {
    setDeleteTarget(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const supabase = createClient();

      // 記事を削除（post_categoriesはCASCADEで自動削除される）
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      // 成功したらページをリフレッシュ
      router.refresh();
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("削除に失敗しました");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* フィルタリング */}
      <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
        <Button
          variant={currentStatus === "all" ? "default" : "outline"}
          size="sm"
          asChild
          className="w-full sm:w-auto"
        >
          <Link href={createStatusUrl("all")}>すべて</Link>
        </Button>
        <Button
          variant={currentStatus === "published" ? "default" : "outline"}
          size="sm"
          asChild
          className="w-full sm:w-auto"
        >
          <Link href={createStatusUrl("published")}>公開</Link>
        </Button>
        <Button
          variant={currentStatus === "draft" ? "default" : "outline"}
          size="sm"
          asChild
          className="w-full sm:w-auto"
        >
          <Link href={createStatusUrl("draft")}>下書き</Link>
        </Button>
        <Button
          variant={currentStatus === "private" ? "default" : "outline"}
          size="sm"
          asChild
          className="w-full sm:w-auto"
        >
          <Link href={createStatusUrl("private")}>非公開</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>記事がありません</CardTitle>
            <CardDescription>
              {currentStatus === "all"
                ? "新規作成ボタンから最初の記事を作成しましょう"
                : `${
                    currentStatus === "published"
                      ? "公開"
                      : currentStatus === "draft"
                      ? "下書き"
                      : "非公開"
                  }の記事がありません`}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {/* デスクトップ: テーブル表示 */}
          <Card className="hidden xl:block pb-0">
        <CardHeader className="pb-3">
          <CardTitle>記事一覧</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="w-64 px-4 py-3 text-left text-sm font-medium">
                    タイトル
                  </th>
                  <th className="w-80 px-4 py-3 text-left text-sm font-medium">
                    抜粋
                  </th>
                  <th className="w-32 px-4 py-3 text-left text-sm font-medium">
                    カテゴリ
                  </th>
                  <th className="w-24 px-4 py-3 text-left text-sm font-medium">
                    ステータス
                  </th>
                  <th className="w-20 px-4 py-3 text-center text-sm font-medium">
                    特集
                  </th>
                  <th className="w-24 px-4 py-3 text-left text-sm font-medium">
                    閲覧数
                  </th>
                  <th className="w-24 px-4 py-3 text-left text-sm font-medium">
                    いいね数
                  </th>
                  <th className="w-36 px-4 py-3 text-left text-sm font-medium">
                    公開日
                  </th>
                  <th className="w-36 px-4 py-3 text-left text-sm font-medium">
                    更新日
                  </th>
                  <th className="w-32 px-4 py-3 text-left text-sm font-medium">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="w-64 px-4 py-3 h-16">
                      <p className="font-medium line-clamp-2">{post.title}</p>
                    </td>
                    <td className="w-80 px-4 py-3 h-16">
                      {post.excerpt && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 h-16">
                      <div className="flex flex-wrap gap-1 line-clamp-2">
                        {post.categories?.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: category.color
                                ? `${category.color}20`
                                : "#e5e7eb",
                              color: category.color || "#374151",
                            }}
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 h-16">
                      <div className="line-clamp-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800"
                              : post.status === "draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {post.status === "published"
                            ? "公開"
                            : post.status === "draft"
                            ? "下書き"
                            : "非公開"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 h-16">
                      <div className="flex justify-center line-clamp-2">
                        {post.is_featured && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm h-16">
                      <div className="flex items-center gap-1 line-clamp-2">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {post.view_count?.toLocaleString() || 0}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm h-16">
                      <div className="flex items-center gap-1 line-clamp-2">
                        <ThumbsUp className="h-3 w-3 text-muted-foreground" />
                        {post.helpful_count?.toLocaleString() || 0}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground h-16">
                      <div className="line-clamp-2">
                        {post.published_at ? formatDate(post.published_at) : "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground h-16">
                      <div className="line-clamp-2">
                        {formatDate(post.updated_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3 h-16">
                      <div className="flex gap-2 line-clamp-2">
                        {post.status === "published" && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/${post.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(post)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* モバイル・タブレット: カード表示 */}
      <div className="space-y-2 xl:hidden">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden py-0">
            <div className="flex">
              {/* 左側: ステータスインジケーター */}
              <div
                className={`w-1 shrink-0 ${
                  post.status === "published"
                    ? "bg-green-500"
                    : post.status === "draft"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
              />

              {/* 右側: コンテンツ */}
              <div className="flex-1 px-3 py-2.5">
                {/* ヘッダー: タイトル + バッジ */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium line-clamp-1 text-sm">
                        {post.title}
                      </h3>
                      {post.is_featured && (
                        <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : post.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {post.status === "published"
                        ? "公開"
                        : post.status === "draft"
                        ? "下書き"
                        : "非公開"}
                    </span>
                  </div>
                </div>

                {/* 中段: カテゴリ + メタ情報 */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
                  {/* カテゴリ */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.categories.slice(0, 2).map((category) => (
                        <span
                          key={category.id}
                          className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: category.color
                              ? `${category.color}15`
                              : "#f3f4f6",
                            color: category.color || "#6b7280",
                          }}
                        >
                          {category.name}
                        </span>
                      ))}
                      {post.categories.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{post.categories.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 区切り */}
                  {post.categories && post.categories.length > 0 && (
                    <span className="text-muted-foreground/30">|</span>
                  )}

                  {/* 統計 */}
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5">
                      <Eye className="h-3 w-3" />
                      {post.view_count?.toLocaleString() || 0}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <ThumbsUp className="h-3 w-3" />
                      {post.helpful_count?.toLocaleString() || 0}
                    </span>
                  </div>

                  {/* 区切り */}
                  <span className="text-muted-foreground/30">|</span>

                  {/* 日付 */}
                  <span>
                    {post.published_at ? formatDate(post.published_at) : "未公開"}
                  </span>
                </div>

                {/* フッター: 操作ボタン */}
                <div className="flex items-center gap-0.5 -ml-1.5">
                  {post.status === "published" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      asChild
                    >
                      <Link href={`/${post.slug}`} target="_blank">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        表示
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    asChild
                  >
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      編集
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(post)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    削除
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <PostsPagination currentPage={currentPage} totalPages={totalPages} />
      )}
        </>
      )}

      {/* 削除確認ダイアログ */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>記事を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。記事「{deleteTarget?.title}
              」を完全に削除します。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "削除中..." : "削除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function PostsPagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
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
              <PaginationLink
                href={createPageUrl(page)}
                size="icon"
              >
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
