import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  FolderOpen,
  Eye,
  ThumbsUp,
  Image as ImageIcon,
  BarChart3,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { AdminPageHeader } from "../_components/admin-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ダッシュボード",
};

const shortcuts = [
  {
    title: "記事管理",
    description: "記事の作成・編集",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "カテゴリ",
    description: "カテゴリの管理",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "画像管理",
    description: "画像のアップロード",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "アナリティクス",
    description: "アクセス解析",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "広告管理",
    description: "AdSense設定",
    href: "/admin/ads",
    icon: DollarSign,
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  // 統計データを取得
  const [
    { count: totalPosts },
    { count: publishedPosts },
    { count: draftPosts },
    { count: totalCategories },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id, title, slug, status, published_at, updated_at, view_count, helpful_count")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(5),
  ]);

  const stats = [
    {
      title: "総記事数",
      value: totalPosts || 0,
      href: "/admin/posts",
    },
    {
      title: "公開中",
      value: publishedPosts || 0,
      href: "/admin/posts?status=published",
      color: "text-green-600",
    },
    {
      title: "下書き",
      value: draftPosts || 0,
      href: "/admin/posts?status=draft",
      color: "text-yellow-600",
    },
    {
      title: "カテゴリ数",
      value: totalCategories || 0,
      href: "/admin/categories",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <AdminPageHeader
        title="ダッシュボード"
        description="ブログの概要と最近の活動"
      />

      {/* ショートカット */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {shortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <Link key={shortcut.href} href={shortcut.href}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <Icon className="h-6 w-6 mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">{shortcut.title}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {shortcut.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 統計 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">統計</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {stats.map((stat) => (
              <Link
                key={stat.title}
                href={stat.href}
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <span className="text-muted-foreground">{stat.title}:</span>
                <span className={`font-semibold ${stat.color || ""}`}>
                  {stat.value}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 最近の記事 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">最近の記事</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/posts" className="flex items-center gap-1">
              すべて見る
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentPosts && recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-medium hover:underline line-clamp-1 text-sm"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
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
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.view_count?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {post.helpful_count?.toLocaleString() || 0}
                      </span>
                      <span className="hidden sm:inline">
                        {formatDate(post.published_at || post.updated_at)}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                    <Link href={`/admin/posts/${post.id}/edit`}>編集</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              まだ記事がありません。新規記事を作成しましょう。
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
