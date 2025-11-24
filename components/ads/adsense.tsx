"use client"

import { useEffect, useState } from "react"

interface AdSenseProps {
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
  className?: string
  /**
   * スケルトンの高さ（デフォルト: 280px）
   */
  skeletonHeight?: string | number
  /**
   * スケルトンを表示するかどうか（デフォルト: true）
   */
  showSkeleton?: boolean
}

export function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  skeletonHeight = "280px",
  showSkeleton = true,
}: AdSenseProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // クライアントサイドでのみマウント
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      try {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error("AdSense error:", err)
        setHasError(true)
      }
    }
  }, [isMounted])

  // 高さの正規化
  const normalizedHeight =
    typeof skeletonHeight === "number" ? `${skeletonHeight}px` : skeletonHeight

  // サーバーサイドレンダリング時はスケルトンを表示
  if (!isMounted) {
    if (!showSkeleton) {
      return <div className={className} style={{ minHeight: normalizedHeight }} />
    }

    return (
      <div
        className={className}
        style={{ minHeight: normalizedHeight }}
        aria-label="広告読み込み中"
      >
        <div
          className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"
          style={{ height: normalizedHeight }}
        >
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-gray-400 dark:text-gray-600">
              Advertisement
            </span>
          </div>
        </div>
      </div>
    )
  }

  // エラー時の表示
  if (hasError) {
    return (
      <div
        className={className}
        style={{ minHeight: normalizedHeight }}
        aria-label="広告の読み込みに失敗しました"
      >
        <div
          className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800"
          style={{ height: normalizedHeight }}
        >
          <span className="text-xs text-gray-400 dark:text-gray-600">
            広告を読み込めませんでした
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={className} suppressHydrationWarning>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7839828582645189"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        suppressHydrationWarning
      />
    </div>
  )
}
