import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { HeaderClient, MobileMenu } from "./header-client"

export default function Header() {
  return (
    <HeaderClient>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ロゴ */}
        <Link href="/" className="text-xl font-bold hover:opacity-80">
          整えて、創る。
        </Link>

        {/* ナビゲーションと右側のボタンエリア */}
        <div className="flex items-center gap-6">
          <nav className="hidden sm:block">
            <ul className="flex items-center gap-6">
              <li>
                <Link
                  href="/works"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  WORKS
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  BLOG
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <AdminLoginButton />
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </div>
    </HeaderClient>
  )
}

async function AdminLoginButton() {
  const { createClient } = await import("@/lib/supabase/server")
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { AdminLoginButtonClient } = await import("./header-client")
  return <AdminLoginButtonClient />
}
