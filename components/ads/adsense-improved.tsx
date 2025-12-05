"use client";

import { useEffect, useState, useRef } from "react";

interface AdSenseImprovedProps {
  adSlot: string;
  adFormat?: "rectangle" | "horizontal" | "vertical" | "auto" | "fluid";
  fullWidthResponsive?: boolean;
  className?: string;
  skeletonHeight?: string | number;
  showSkeleton?: boolean;
  width?: string;
  height?: string;
  /**
   * 広告が表示されない場合のフォールバック動作
   * - "hide": 非表示にする（デフォルト）
   * - "placeholder": プレースホルダーを表示
   * - "keep": そのまま残す（開発用）
   */
  fallbackMode?: "hide" | "placeholder" | "keep";
}

export function AdSenseImproved({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  skeletonHeight,
  showSkeleton = true,
  width,
  height,
  fallbackMode = "hide",
}: AdSenseImprovedProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [adStatus, setAdStatus] = useState<"loading" | "loaded" | "failed" | "empty">("loading");
  const insRef = useRef<HTMLModElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  const getDefaultSkeletonHeight = (): string => {
    if (skeletonHeight) {
      return typeof skeletonHeight === "number"
        ? `${skeletonHeight}px`
        : skeletonHeight;
    }

    if (height) return height;

    switch (adFormat) {
      case "rectangle": return "250px";
      case "horizontal": return "90px";
      case "vertical": return "600px";
      case "fluid": return "280px";
      default: return "280px";
    }
  };

  const normalizedHeight = getDefaultSkeletonHeight();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !insRef.current || pushedRef.current) return;

    const container = insRef.current;
    let retryCount = 0;
    const maxRetries = 10; // リトライ回数を増やす

    const tryPushAd = () => {
      try {
        if (typeof window === "undefined" || !container) return;

        // 表示状態をチェック
        const computedStyle = window.getComputedStyle(container);
        if (computedStyle.display === "none" || computedStyle.visibility === "hidden") {
          return;
        }

        // 親要素の表示状態もチェック
        let parent = container.parentElement;
        while (parent && parent !== document.body) {
          const parentStyle = window.getComputedStyle(parent);
          if (parentStyle.display === "none" || parentStyle.visibility === "hidden") {
            return;
          }
          parent = parent.parentElement;
        }

        // 幅チェック
        const containerWidth = container.clientWidth;
        const boundingRect = container.getBoundingClientRect();

        if (containerWidth === 0 || boundingRect.width === 0) {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(tryPushAd, 200); // 待機時間を200msに延長
            return;
          } else {
            console.warn(`AdSense: Container width is 0 after ${maxRetries} retries`);
            setAdStatus("failed");
            return;
          }
        }

        // すでに処理済みかチェック
        if (container.getAttribute("data-adsbygoogle-status")) {
          setAdStatus("loaded");
          return;
        }

        // AdSenseスクリプトの読み込みをチェック
        if (!window.adsbygoogle) {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(tryPushAd, 200);
            return;
          } else {
            console.error("AdSense script not loaded");
            setAdStatus("failed");
            return;
          }
        }

        // push実行
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;

          // push後、実際に広告が表示されたかチェック
          setTimeout(() => {
            checkAdDisplay();
          }, 2000);
        } catch (pushErr) {
          console.error("AdSense push error:", pushErr);
          setAdStatus("failed");
        }
      } catch (err) {
        console.error("AdSense fatal error:", err);
        setAdStatus("failed");
      }
    };

    // 広告表示確認
    const checkAdDisplay = () => {
      if (!container) return;

      const status = container.getAttribute("data-adsbygoogle-status");

      if (status === "done") {
        // iframeまたは広告コンテンツが存在するかチェック
        const hasIframe = container.querySelector("iframe");
        const hasAdContent = container.querySelector("ins > div");

        if (hasIframe || hasAdContent) {
          setAdStatus("loaded");
        } else {
          // ステータスはdoneだが広告がない = 広告在庫なし
          setAdStatus("empty");
        }
      } else if (status === "unfilled") {
        setAdStatus("empty");
      }
    };

    // 初回実行を遅延（レイアウト安定を待つ）
    const initialDelay = setTimeout(tryPushAd, 300);

    return () => {
      clearTimeout(initialDelay);
    };
  }, [isMounted, adSlot]);

  // SSR時
  if (!isMounted) {
    if (!showSkeleton) return null;

    return (
      <div className={className} aria-label="広告読み込み中">
        <div
          className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"
          style={{
            height: normalizedHeight,
            width: width || "100%",
            maxWidth: width || "none",
          }}
        >
          <div className="flex h-full items-center justify-center">
            <span className="text-xs text-gray-400 dark:text-gray-600">
              Advertisement
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 広告が読み込めなかった場合の処理
  if (adStatus === "failed") {
    if (fallbackMode === "hide") return null;
    if (fallbackMode === "placeholder") {
      return (
        <div className={className}>
          <div
            className="bg-gray-100 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
            style={{
              height: normalizedHeight,
              width: width || "100%",
            }}
          >
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-gray-400">広告読み込みエラー</span>
            </div>
          </div>
        </div>
      );
    }
  }

  // 広告在庫がない場合
  if (adStatus === "empty") {
    if (fallbackMode === "hide") return null;
    if (fallbackMode === "placeholder") {
      return (
        <div className={className}>
          <div
            className="bg-gray-50 dark:bg-gray-900 rounded-lg"
            style={{
              height: normalizedHeight,
              width: width || "100%",
            }}
          >
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-gray-400">広告在庫なし</span>
            </div>
          </div>
        </div>
      );
    }
  }

  // 広告を表示
  const adStyle: React.CSSProperties =
    width && height
      ? { display: "inline-block", width, height }
      : { display: "block" };

  return (
    <div ref={containerRef} className={className} suppressHydrationWarning>
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
