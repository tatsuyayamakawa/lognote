"use client";

import { useEffect, useState, useRef } from "react";

interface AdSenseProps {
  adSlot: string;
  adFormat?: "rectangle" | "horizontal" | "vertical" | "auto" | "fluid";
  fullWidthResponsive?: boolean;
  className?: string;
  /**
   * スケルトンの高さ（デフォルト: adFormatから自動計算）
   */
  skeletonHeight?: string | number;
  /**
   * スケルトンを表示するかどうか（デフォルト: true）
   */
  showSkeleton?: boolean;
  /**
   * 固定サイズの幅（例: "300px"）
   */
  width?: string;
  /**
   * 固定サイズの高さ（例: "250px"）
   */
  height?: string;
}

export function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  skeletonHeight,
  showSkeleton = true,
  width,
  height,
}: AdSenseProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const insRef = useRef<HTMLModElement>(null);

  // adFormatに基づいてデフォルトのスケルトン高さを計算
  const getDefaultSkeletonHeight = (): string => {
    if (skeletonHeight) {
      return typeof skeletonHeight === "number" ? `${skeletonHeight}px` : skeletonHeight;
    }

    // width/heightが指定されている場合はそれを使用
    if (height) {
      return height;
    }

    // adFormatに基づいてデフォルト高さを設定
    switch (adFormat) {
      case "rectangle":
        return "250px"; // 300x250
      case "horizontal":
        return "90px"; // 728x90
      case "vertical":
        return "600px"; // 300x600
      default:
        return "280px"; // auto/その他
    }
  };

  const normalizedHeight = getDefaultSkeletonHeight();

  useEffect(() => {
    // クライアントサイドでのみマウント
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isMounted || !insRef.current) return;

    let retryCount = 0;
    const maxRetries = 5;
    let pushed = false;

    const tryPushAd = () => {
      try {
        // AdSenseスクリプトが読み込まれているか確認
        if (typeof window === 'undefined' || !insRef.current) return;

        const container = insRef.current;

        // コンテナの幅をチェック（display:noneでないことも確認）
        const computedStyle = window.getComputedStyle(container);
        const containerWidth = container.clientWidth;
        const containerOffsetWidth = container.offsetWidth;
        const boundingRect = container.getBoundingClientRect();

        // display:noneの場合はスキップ（レスポンシブ広告の非表示側）
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
          console.log('AdSense: Container is hidden');
          return;
        }

        // 親要素も含めて表示されているかチェック
        let parent = container.parentElement;
        while (parent) {
          const parentStyle = window.getComputedStyle(parent);
          if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') {
            console.log('AdSense: Parent element is hidden');
            return;
          }
          parent = parent.parentElement;
        }

        // 複数の幅チェックを行う
        if (containerWidth === 0 || containerOffsetWidth === 0 || boundingRect.width === 0) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`AdSense: Container width is 0, retrying... (${retryCount}/${maxRetries})`, {
              clientWidth: containerWidth,
              offsetWidth: containerOffsetWidth,
              boundingWidth: boundingRect.width
            });
            setTimeout(tryPushAd, 100);
            return;
          } else {
            console.warn('AdSense: Container width still 0 after retries');
            return;
          }
        }

        // すでにpushされているかチェック
        if (pushed) {
          console.log('AdSense: Already pushed');
          return;
        }

        // data-adsbygoogle-status属性をチェック（すでに処理済みか確認）
        if (container.getAttribute('data-adsbygoogle-status')) {
          console.log('AdSense: Already processed by AdSense script');
          return;
        }

        // adsbygoogle配列を初期化してpush
        console.log('AdSense: Pushing ad to adsbygoogle queue', {
          adSlot,
          clientWidth: containerWidth,
          offsetWidth: containerOffsetWidth,
          boundingWidth: boundingRect.width,
          display: computedStyle.display,
          visibility: computedStyle.visibility
        });
        const adsbygoogle = (window.adsbygoogle = window.adsbygoogle || []);

        try {
          adsbygoogle.push({});
          pushed = true;
          console.log('AdSense: Successfully pushed ad');
        } catch (pushErr) {
          console.error('AdSense push error:', pushErr);
          // AdSenseのエラーでもコンポーネントは表示し続ける
          // このエラーは開発環境や一時的な問題の可能性がある
        }
      } catch (err) {
        console.error('AdSense fatal error:', err);
        queueMicrotask(() => {
          setHasError(true);
        });
      }
    };

    // 初回実行は500ms後（スクリプト読み込みとレイアウト完成を待つ）
    const timer = setTimeout(tryPushAd, 500);

    return () => clearTimeout(timer);
  }, [isMounted, adSlot]);

  // サーバーサイドレンダリング時はスケルトンを表示
  if (!isMounted) {
    if (!showSkeleton) {
      return (
        <div className={className} style={{ minHeight: normalizedHeight }} />
      );
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
    );
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
    );
  }

  // 広告のスタイル：固定サイズまたはfluidでも高さを確保
  const adStyle: React.CSSProperties = width && height
    ? { display: "inline-block", width, height }
    : { display: "block", minHeight: normalizedHeight };

  return (
    <div
      className={className}
      style={{ minHeight: normalizedHeight }}
      suppressHydrationWarning
    >
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
