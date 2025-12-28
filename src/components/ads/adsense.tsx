"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AdSenseProps {
  adSlot: string;
  adFormat?: "rectangle" | "horizontal" | "vertical" | "auto" | "fluid";
  fullWidthResponsive?: boolean;
  className?: string;
  width?: string;
  height?: string;
  placeholderHeight?: string;
  showSkeleton?: boolean;
  layout?: "in-article";
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
}: AdSenseProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pathname = usePathname();
  const isProduction = process.env.NODE_ENV === "production";
  const actualPlaceholderHeight = placeholderHeight || height || "300px";

  useEffect(() => {
    if (!isProduction || !insRef.current) return;

    const container = insRef.current;
    if (container.getAttribute("data-adsbygoogle-status")) return;

    let isInitialized = false;

    const initAd = () => {
      if (isInitialized || container.getAttribute("data-adsbygoogle-status")) {
        return;
      }

      const computedStyle = window.getComputedStyle(container);
      if (computedStyle.display === "none" || computedStyle.visibility === "hidden") {
        return;
      }

      // Fluid広告の場合のみ親要素の幅をチェック
      const isFluid = layout === "in-article" || adFormat === "fluid";
      if (isFluid && (container.parentElement?.clientWidth || 0) < 250) {
        return;
      }

      isInitialized = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense initialization error:", error);
        isInitialized = false;
      }
    };

    // 要素がDOMに完全に追加されるのを待つ
    const initTimer = setTimeout(() => {
      // DOMに追加されているか確認
      if (document.body.contains(container)) {
        initAd();
      }
    }, 0);

    // MutationObserverで親要素の変更を監視
    const observer = new MutationObserver(() => {
      if (!isInitialized && document.body.contains(container)) {
        initAd();
      }
    });

    // 親要素を監視
    if (container.parentElement) {
      observer.observe(container.parentElement, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(initTimer);
      observer.disconnect();
    };
  }, [pathname, isProduction, adSlot, layout, adFormat]);

  if (!isProduction && showSkeleton) {
    const isInArticle = layout === "in-article" || adFormat === "fluid";
    const skeletonLabel = isInArticle ? "記事内広告" :
                          adFormat === "horizontal" ? "横長バナー広告" :
                          adFormat === "rectangle" ? "スクエア広告" :
                          adFormat === "vertical" ? "縦長広告" : "広告";
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
            <p className="text-sm! text-gray-500 dark:text-gray-400 mb-0! font-semibold">
              {skeletonLabel}
            </p>
            <p className="text-xs! text-gray-400 dark:text-gray-500 mt-1! font-mono">
              {adSlot}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isFixedFormat = adFormat === "rectangle" || adFormat === "horizontal" || adFormat === "vertical";
  const isFixedSize = !!(width && height) || isFixedFormat;
  
  const adStyle: React.CSSProperties = width && height
    ? { display: "inline-block", width, height }
    : { display: "block", width: "100%" };

  const containerStyle: React.CSSProperties = {
    minHeight: actualPlaceholderHeight,
    width: "100%",
    maxWidth: "100%",
    display: isFixedSize ? "flex" : "block",
    ...(isFixedSize && { justifyContent: "center" }),
    overflow: "hidden",
  };

  return (
    <div className={className} style={containerStyle} suppressHydrationWarning>
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
