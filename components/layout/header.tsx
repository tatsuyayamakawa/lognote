import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { HeaderClient } from "./header-client"

export default function Header() {
  return (
    <HeaderClient>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ロゴ */}
        <Link href="/" className="text-xl font-bold hover:opacity-80">
          整えて、創る。
        </Link>

        {/* 右側のボタンエリア */}
        <div className="flex items-center gap-2">
          <AdminLoginButton />
          <ThemeToggle />
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
