import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "./_components/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* サイドバー - 固定 */}
      <AdminSidebar user={user} />

      {/* メインコンテンツ - スクロール可能 */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
