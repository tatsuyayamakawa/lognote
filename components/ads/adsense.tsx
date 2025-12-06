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

    // 初期化済みフラグ
    let isInitialized = false;

    // IntersectionObserverで要素が表示されたタイミングで初期化
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // すでに初期化済み、または要素が表示されていない場合はスキップ
          if (isInitialized || !entry.isIntersecting || entry.target !== container) {
            return;
          }

          // 再度処理済みチェック（data-adsbygoogle-status属性）
          if (container.getAttribute("data-adsbygoogle-status")) {
            observer.disconnect();
            return;
          }

          // 親要素の幅をチェック（ins要素は空なので幅0になる可能性がある）
          const parentWidth = container.parentElement?.clientWidth || 0;
          const containerWidth = container.clientWidth;

          // 親要素の幅が250px未満の場合は初期化しない（fluid広告の最小幅）
          if (parentWidth < 250) {
            console.warn(
              `AdSense: Parent width is too small for slot ${adSlot}. Skipping initialization.`,
              { parentWidth, containerWidth }
            );
            // 幅が小さすぎる場合はObserverを解除（再試行しない）
            observer.disconnect();
            return;
          }

          // 初期化実行
          isInitialized = true;
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            // 初期化成功後はObserverを解除
            observer.disconnect();
          } catch (error) {
            console.error("AdSense initialization error:", error);
            isInitialized = false; // エラー時はフラグをリセット
          }
        });
      },
      {
        root: null,
        rootMargin: "50px", // 50px手前から検知開始
        threshold: 0.01, // 1%でも表示されたら
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [pathname, isProduction, adSlot]); // pathnameが変わるたびに再初期化

  // 開発環境ではプレースホルダーを表示
  if (!isProduction && showSkeleton) {
    return (
      <div className={`${className} flex justify-center`} style={{ minHeight: actualPlaceholderHeight }}>
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

  // adFormatが固定フォーマット（rectangle/horizontal/vertical）かどうか
  const isFixedFormat = adFormat === "rectangle" || adFormat === "horizontal" || adFormat === "vertical";

  // 固定サイズ広告かどうかの判定
  // width/heightが指定されているか、固定フォーマットが指定されている場合
  const isFixedSize = !!(width && height) || isFixedFormat;

  // 広告のスタイル
  const adStyle: React.CSSProperties = width && height
    ? { display: "inline-block", width, height }
    : { display: "block", width: "100%" }; // fluid広告には幅100%を設定

  // コンテナスタイル: 固定高さでレイアウトシフトを防ぐ + 中央寄せ
  const containerStyle: React.CSSProperties = {
    minHeight: actualPlaceholderHeight,
    width: width || "100%",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <div className={className} style={containerStyle} suppressHydrationWarning>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-7839828582645189"
        data-ad-slot={adSlot}
        {...(!isFixedSize && { "data-ad-format": adFormat })}
        {...(!isFixedSize && { "data-full-width-responsive": fullWidthResponsive.toString() })}
        suppressHydrationWarning
      />
    </div>
  );
}
