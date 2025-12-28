"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center px-4 py-16">
      <div className="text-center space-y-6">
        {/* 404テキスト */}
        <h1 className="text-9xl font-bold text-muted-foreground/30">404</h1>

        {/* メッセージ */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">ページが見つかりません</h2>
          <p className="text-muted-foreground max-w-md">
            お探しのページは存在しないか、移動または削除された可能性があります。
          </p>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="default" size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              ホームに戻る
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            前のページへ
          </Button>
        </div>
      </div>
    </div>
  )
}
