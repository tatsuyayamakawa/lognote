"use client"

import { AdSense } from "./adsense"

interface ResponsiveAdProps {
  pcSlot?: string
  mobileSlot?: string
  className?: string
  /**
   * PC用の広告設定
   */
  pcConfig?: {
    width?: string
    height?: string
    adFormat?: "rectangle" | "horizontal" | "vertical" | "auto" | "fluid"
    fullWidthResponsive?: boolean
    layout?: "in-article"
    placeholderHeight?: string
  }
  /**
   * モバイル用の広告設定
   */
  mobileConfig?: {
    width?: string
    height?: string
    adFormat?: "rectangle" | "horizontal" | "vertical" | "auto" | "fluid"
    fullWidthResponsive?: boolean
    layout?: "in-article"
    placeholderHeight?: string
  }
}

export function ResponsiveAd({
  pcSlot,
  mobileSlot,
  className = "",
  pcConfig = {},
  mobileConfig = {},
}: ResponsiveAdProps) {
  // 広告が設定されていない場合は何も表示しない
  if (!pcSlot && !mobileSlot) {
    return null
  }

  // PC用とモバイル用のスロットIDがある場合
  if (pcSlot && mobileSlot) {
    return (
      <>
        {/* PC用広告 */}
        <div className={`hidden md:block ${className}`}>
          <div className={pcConfig.adFormat === "fluid" ? "" : "text-center"}>
            <span className="text-xs text-muted-foreground block text-center mb-2 has-[+div>.adsbygoogle[data-ad-status='unfilled']]:hidden has-[+div>.adsbygoogle:empty]:hidden">
              スポンサーリンク
            </span>
            <div className={pcConfig.adFormat === "fluid" ? "" : "flex justify-center"}>
              <AdSense
                adSlot={pcSlot}
                adFormat={pcConfig.adFormat}
                fullWidthResponsive={pcConfig.fullWidthResponsive}
                width={pcConfig.width}
                height={pcConfig.height}
                layout={pcConfig.layout}
                placeholderHeight={pcConfig.placeholderHeight}
              />
            </div>
          </div>
        </div>
        {/* モバイル用広告 */}
        <div className={`block md:hidden ${className}`}>
          <div className={mobileConfig.adFormat === "fluid" ? "" : "text-center"}>
            <span className="text-xs text-muted-foreground block text-center mb-2 has-[+div>.adsbygoogle[data-ad-status='unfilled']]:hidden has-[+div>.adsbygoogle:empty]:hidden">
              スポンサーリンク
            </span>
            <div className={mobileConfig.adFormat === "fluid" ? "" : "flex justify-center"}>
              <AdSense
                adSlot={mobileSlot}
                adFormat={mobileConfig.adFormat}
                fullWidthResponsive={mobileConfig.fullWidthResponsive}
                width={mobileConfig.width}
                height={mobileConfig.height}
                layout={mobileConfig.layout}
                placeholderHeight={mobileConfig.placeholderHeight}
              />
            </div>
          </div>
        </div>
      </>
    )
  }

  // PC用のみ
  if (pcSlot) {
    return (
      <div className={`hidden md:block ${className}`}>
        <div className={pcConfig.adFormat === "fluid" ? "" : "text-center"}>
          <span className="text-xs text-muted-foreground block text-center mb-2 has-[+div>.adsbygoogle[data-ad-status='unfilled']]:hidden has-[+div>.adsbygoogle:empty]:hidden">
            スポンサーリンク
          </span>
          <div className={pcConfig.adFormat === "fluid" ? "" : "flex justify-center"}>
            <AdSense
              adSlot={pcSlot}
              adFormat={pcConfig.adFormat}
              fullWidthResponsive={pcConfig.fullWidthResponsive}
              width={pcConfig.width}
              height={pcConfig.height}
              layout={pcConfig.layout}
              placeholderHeight={pcConfig.placeholderHeight}
            />
          </div>
        </div>
      </div>
    )
  }

  // モバイル用のみ
  if (mobileSlot) {
    return (
      <div className={`block md:hidden ${className}`}>
        <div className={mobileConfig.adFormat === "fluid" ? "" : "text-center"}>
          <span className="text-xs text-muted-foreground block text-center mb-2 has-[+div>.adsbygoogle[data-ad-status='unfilled']]:hidden has-[+div>.adsbygoogle:empty]:hidden">
            スポンサーリンク
          </span>
          <div className={mobileConfig.adFormat === "fluid" ? "" : "flex justify-center"}>
            <AdSense
              adSlot={mobileSlot}
              adFormat={mobileConfig.adFormat}
              fullWidthResponsive={mobileConfig.fullWidthResponsive}
              width={mobileConfig.width}
              height={mobileConfig.height}
              layout={mobileConfig.layout}
              placeholderHeight={mobileConfig.placeholderHeight}
            />
          </div>
        </div>
      </div>
    )
  }

  return null
}
