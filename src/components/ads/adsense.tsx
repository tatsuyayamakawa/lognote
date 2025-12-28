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
    if (!isProduction) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense initialization error:", error);
    }
  }, [pathname, isProduction]);

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
