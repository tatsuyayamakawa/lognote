"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AdSenseProps {
  adSlot: string;
  adFormat?: "rectangle" | "horizontal" | "vertical" | "auto" | "fluid";
  fullWidthResponsive?: boolean;
  className?: string;
  /**
   * 固定サイズの幅（例: "300px"）
   */
  width?: string;
  /**
   * 固定サイズの高さ（例: "250px"）
   */
  height?: string;
  /**
   * プレースホルダーの高さ（デフォルト: heightまたは300px）
   */
  placeholderHeight?: string;
  /**
   * 開発環境でスケルトンを表示するか（デフォルト: true）
   */
  showSkeleton?: boolean;
}

export function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  width,
  height,
  placeholderHeight,
  showSkeleton = true,
}: AdSenseProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pathname = usePathname(); // ページ遷移検知

  // 本番環境かどうか
  const isProduction = process.env.NODE_ENV === "production";

  // 実際のプレースホルダー高さを計算
  const actualPlaceholderHeight = placeholderHeight || height || "300px";

  useEffect(() => {
    // 開発環境では広告を初期化しない
    if (!isProduction) return;

    if (!insRef.current) return;

    const container = insRef.current;

    // すでに処理済みの場合はスキップ
    if (container.getAttribute("data-adsbygoogle-status")) {
      return;
    }

    // AdSenseスクリプトを初期化
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense initialization error:", error);
    }
  }, [pathname, isProduction]); // pathnameが変わるたびに再初期化

  // 開発環境ではプレースホルダーを表示
  if (!isProduction && showSkeleton) {
    return (
      <div className={className} style={{ minHeight: actualPlaceholderHeight }}>
        <div
          className="flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 rounded"
          style={{ height: actualPlaceholderHeight, width: width || "100%" }}
        >
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              AdSense Ad Slot
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {adSlot}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 広告のスタイル
  const adStyle: React.CSSProperties = width && height
    ? { display: "inline-block", width, height }
    : { display: "block" };

  // コンテナスタイル: 固定高さでレイアウトシフトを防ぐ
  const containerStyle: React.CSSProperties = {
    minHeight: actualPlaceholderHeight,
    width: width || "100%",
  };

  return (
    <div className={className} style={containerStyle} suppressHydrationWarning>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-7839828582645189"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        suppressHydrationWarning
      />
    </div>
  );
}
