"use client"

import { AdSense } from "./adsense"

interface DualAdProps {
  slot1?: string
  slot2?: string
  className?: string
  width?: string
  height?: string
}

/**
 * PC用の2つの広告を横並びで表示するコンポーネント
 */
export function DualAd({
  slot1,
  slot2,
  className = "",
  width = "300px",
  height = "250px",
}: DualAdProps) {
  if (!slot1 && !slot2) {
    return null
  }

  return (
    <div className={`hidden md:block ${className}`}>
      <div className="text-center mb-1">
        <span className="text-xs text-muted-foreground">スポンサーリンク</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {slot1 && (
          <AdSense
            adSlot={slot1}
            width={width}
            height={height}
            adFormat="rectangle"
            fullWidthResponsive={false}
            showSkeleton={false}
          />
        )}
        {slot2 && (
          <AdSense
            adSlot={slot2}
            width={width}
            height={height}
            adFormat="rectangle"
            fullWidthResponsive={false}
            showSkeleton={false}
          />
        )}
      </div>
    </div>
  )
}
