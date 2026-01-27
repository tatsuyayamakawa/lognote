"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  X,
  LogOut,
  DollarSign,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useMobileMenu } from "./mobile-menu-context"
import type { User } from "@supabase/supabase-js"

const menuItems = [
  {
    title: "ダッシュボード",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "記事管理",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "カテゴリ",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "画像管理",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "アナリティクス",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "広告管理",
    href: "/admin/ads",
    icon: DollarSign,
  },
]

interface AdminSidebarProps {
  user: User
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, close } = useMobileMenu()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <>
      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          onClick={close}
        />
      )}

      {/* サイドバー */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform xl:static xl:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
      {/* モバイル: メニューを閉じるボタン */}
      {isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 xl:hidden"
          onClick={close}
        >
          <X className="h-6 w-6" />
        </Button>
      )}
      {/* ロゴ */}
      <div className="border-b p-6">
        <Link href="/admin/dashboard">
          <h2 className="text-xl font-bold">整えて、創る。</h2>
          <p className="text-sm text-muted-foreground">管理画面</p>
        </Link>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => close()}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* フッター */}
      <div className="mt-auto border-t">
        {/* ユーザー情報 */}
        <div className="border-b bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">ログイン中</p>
          <p className="mt-1 truncate text-sm font-medium">{user.email}</p>
        </div>

        {/* アクション */}
        <div className="p-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            target="_blank"
            onClick={() => close()}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            サイトを表示
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            ログアウト
          </button>
        </div>
      </div>
    </aside>
    </>
  )
}
