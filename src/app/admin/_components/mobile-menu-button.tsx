"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobileMenu } from "./mobile-menu-context"

export function MobileMenuButton() {
  const { open } = useMobileMenu()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="shrink-0 xl:hidden"
      onClick={open}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">メニューを開く</span>
    </Button>
  )
}
