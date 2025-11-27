"use client";

import { useEffect, useState } from "react";

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  /**
   * スケルトンの高さ（デフォルト: 280px）
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
  skeletonHeight = "280px",
  showSkeleton = true,
  width,
  height,
}: AdSenseProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみマウント
    queueMicrotask(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let retryCount = 0;
    const maxRetries = 5;

    const tryPushAd = () => {
      try {
        // AdSenseスクリプトが読み込まれているか確認
        if (typeof window === 'undefined') return;

        const adContainers = document.querySelectorAll('.adsbygoogle');
        const lastContainer = adContainers[adContainers.length - 1];

        // コンテナの幅をチェック（display:noneでないことも確認）
        if (lastContainer) {
          const element = lastContainer as HTMLElement;
          const computedStyle = window.getComputedStyle(element);
          const containerWidth = element.clientWidth;

          // display:noneの場合はスキップ（レスポンシブ広告の非表示側）
          if (computedStyle.display === 'none') {
            // これは意図的な非表示なのでエラーではない
            return;
          }

          if (containerWidth === 0) {
            retryCount++;
            if (retryCount < maxRetries) {
              // 50ms後にリトライ
              setTimeout(tryPushAd, 50);
              return;
            } else {
              // リトライ後も幅が0の場合は静かにスキップ
              return;
            }
          }
        }

        // adsbygoogle配列を初期化してpush
        const adsbygoogle = (window.adsbygoogle = window.adsbygoogle || []);
        adsbygoogle.push({});
      } catch (err) {
        // 開発環境ではAdSenseエラーが発生するため、静かにスキップ
        // 本番環境では正常に動作します
        console.warn('AdSense error:', err);
        queueMicrotask(() => {
          setHasError(true);
        });
      }
    };

    // 初回実行は100ms後
    const timer = setTimeout(tryPushAd, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  // 高さの正規化
  const normalizedHeight =
    typeof skeletonHeight === "number" ? `${skeletonHeight}px` : skeletonHeight;

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

  // 固定サイズの広告の場合のスタイル
  const adStyle: React.CSSProperties = width && height
    ? { display: "inline-block", width, height }
    : { display: "block" };

  return (
    <div className={className} suppressHydrationWarning>
      <ins
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
