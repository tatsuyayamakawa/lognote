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
  /**
   * レイアウト種別（記事内広告用）
   */
  layout?: "in-article";
  /**
   * 広告の配置場所による背景色の変更
   * - "in-article": 記事内（md:bg-card）
   * - "outside-article": 記事外（md:bg-zinc-50）
   * デフォルトは "in-article"
   */
  variant?: "in-article" | "outside-article";
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
  layout,
  variant = "in-article",
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

    // 要素が表示されているかチェックする関数
    const checkVisibility = () => {
      if (isInitialized) return;

      // すでに処理済みの場合はスキップ
      if (container.getAttribute("data-adsbygoogle-status")) {
        isInitialized = true;
        return;
      }

      // 要素のサイズと表示状態をチェック
      const computedStyle = window.getComputedStyle(container);
      const isDisplayNone = computedStyle.display === "none";
      const isVisibilityHidden = computedStyle.visibility === "hidden";

      // display:noneやvisibility:hiddenの場合はスキップ
      if (isDisplayNone || isVisibilityHidden) {
        return;
      }

      // 固定サイズ広告でない場合（fluid広告）は、親要素の幅をチェック
      const parentWidth = container.parentElement?.clientWidth || 0;
      const isFluid = layout === "in-article" || adFormat === "fluid";

      // fluid広告の場合、親要素の幅が250px未満ならスキップ
      if (isFluid && parentWidth < 250) {
        return;
      }

      // 初期化実行
      isInitialized = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense initialization error:", error);
        isInitialized = false; // エラー時はフラグをリセット
      }
    };

    // IntersectionObserver: スクロールで表示されたタイミング
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            checkVisibility();
          }
        });
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.01,
      }
    );

    observer.observe(container);

    // ResizeObserver: レスポンシブで表示状態が変わったタイミング
    const resizeObserver = new ResizeObserver(() => {
      checkVisibility();
    });

    resizeObserver.observe(container);

    // 初回チェック（ファーストビュー用）- 少し遅延してCSSが適用されるのを待つ
    const initialCheck = setTimeout(() => {
      checkVisibility();
    }, 100);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      clearTimeout(initialCheck);
    };
  }, [pathname, isProduction, adSlot, adFormat, fullWidthResponsive, className, width, height, placeholderHeight, showSkeleton, layout, variant]); // pathnameが変わるたびに再初期化

  // 開発環境ではプレースホルダーを表示
  if (!isProduction && showSkeleton) {
    // 記事内広告用のスケルトン
    const isInArticle = layout === "in-article" || adFormat === "fluid";
    const skeletonLabel = isInArticle ? "記事内広告" :
                          adFormat === "horizontal" ? "横長バナー広告" :
                          adFormat === "rectangle" ? "スクエア広告" :
                          adFormat === "vertical" ? "縦長広告" : "広告";

    // 固定サイズかどうかの判定
    const isFixedForSkeleton = !!(width && height);

    return (
      <div
        className={`${className}`}
        style={{
          minHeight: actualPlaceholderHeight,
          display: isFixedForSkeleton ? "flex" : "block",
          ...(isFixedForSkeleton && { justifyContent: "center" }),
        }}
      >
        <div
          className="flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 rounded"
          style={{ height: actualPlaceholderHeight, width: width || "100%" }}
        >
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
              {skeletonLabel}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
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

  // コンテナスタイル: 固定高さでレイアウトシフトを防ぐ
  // 固定サイズの場合は中央寄せ、fluid広告の場合は幅100%
  const containerStyle: React.CSSProperties = {
    minHeight: actualPlaceholderHeight,
    width: "100%", // 常に100%にして中央寄せを有効にする
    maxWidth: "100%", // 親要素からはみ出さないようにする
    display: isFixedSize ? "flex" : "block",
    ...(isFixedSize && { justifyContent: "center" }),
    overflow: "hidden", // はみ出し防止
  };

  // 背景色: variantに応じて記事内/記事外で切り替え
  const bgClassName = variant === "in-article"
    ? "bg-zinc-50 dark:bg-black md:bg-card md:dark:bg-card"
    : "bg-zinc-50 dark:bg-black";

  return (
    <div
      className={`${className} ${bgClassName}`}
      style={containerStyle}
      suppressHydrationWarning
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-7839828582645189"
        data-ad-slot={adSlot}
        {...(adFormat && adFormat !== "auto" && { "data-ad-format": adFormat })}
        {...(!isFixedSize && fullWidthResponsive !== undefined
          ? { "data-full-width-responsive": fullWidthResponsive.toString() }
          : isFixedSize
          ? { "data-full-width-responsive": "false" }
          : {})}
        {...(layout && { "data-ad-layout": layout })}
        suppressHydrationWarning
      />
    </div>
  );
}
