"use client";

import { useEffect, useRef } from "react";

interface AdSenseStaticProps {
  adSlot: string;
  adFormat?: "rectangle" | "horizontal" | "vertical" | "auto" | "fluid";
  fullWidthResponsive?: boolean;
  className?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}

/**
 * AdSense静的埋め込みコンポーネント
 * - より確実に広告を表示
 * - シンプルな実装
 * - Reactの状態管理を最小限に
 */
export function AdSenseStatic({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  width,
  height,
  style,
}: AdSenseStaticProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;

    // 少し遅延させてDOMが安定してから実行
    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
        }
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const adStyle: React.CSSProperties = {
    display: width && height ? "inline-block" : "block",
    ...(width && { width }),
    ...(height && { height }),
    ...style,
  };

  return (
    <div ref={containerRef} className={className}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-7839828582645189"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
