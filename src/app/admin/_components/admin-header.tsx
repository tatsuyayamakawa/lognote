"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface AdminHeaderProps {
  user: User
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-8 pl-16 md:pl-8">
      <div>
        <p className="text-sm text-muted-foreground">ログイン中</p>
        <p className="font-medium">{user.email}</p>
      </div>

      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        ログアウト
      </Button>
    </header>
  )
}
