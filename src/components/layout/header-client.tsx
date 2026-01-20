"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { LogIn, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface HeaderClientProps {
  children: React.ReactNode
}

export function HeaderClient({ children }: HeaderClientProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // スクロール位置が50px未満の場合は常に表示
      if (currentScrollY < 50) {
        setIsVisible(true)
        setLastScrollY(currentScrollY)
        return
      }

      // 下にスクロール（隠す）
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      // 上にスクロール（表示）
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [lastScrollY])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      {children}
    </header>
  )
}

export function AdminLoginButtonClient() {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="hover:bg-accent"
    >
      <Link href="/admin/dashboard" aria-label="管理画面">
        <LogIn className="h-5 w-5" />
      </Link>
    </Button>
  )
}

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden hover:bg-accent"
          aria-label="メニューを開く"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full p-0 border-0 mobile-menu-sheet"
      >
        <div className="flex flex-col items-center justify-center h-full bg-background">
          <SheetHeader className="sr-only">
            <SheetTitle>メニュー</SheetTitle>
            <SheetDescription>ナビゲーションメニュー</SheetDescription>
          </SheetHeader>
          <nav className="w-full px-8">
            <ul className="flex flex-col gap-6">
              <li
                className="animate-slide-in-right opacity-0"
                style={{
                  animationDelay: '0.3s',
                  animationFillMode: 'forwards'
                }}
              >
                <Link
                  href="/works"
                  className="block text-4xl font-bold transition-colors hover:text-primary text-right"
                  onClick={() => setOpen(false)}
                >
                  WORKS
                </Link>
              </li>
              <li
                className="animate-slide-in-right opacity-0"
                style={{
                  animationDelay: '0.4s',
                  animationFillMode: 'forwards'
                }}
              >
                <Link
                  href="/posts"
                  className="block text-4xl font-bold transition-colors hover:text-primary text-right"
                  onClick={() => setOpen(false)}
                >
                  BLOG
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
