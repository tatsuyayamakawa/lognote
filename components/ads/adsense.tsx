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
  const [shouldHide, setShouldHide] = useState(false);
  const insRef = useRef<HTMLModElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // adFormatに基づいてデフォルトのスケルトン高さを計算
  const getDefaultSkeletonHeight = (): string => {
    if (skeletonHeight) {
      return typeof skeletonHeight === "number"
        ? `${skeletonHeight}px`
        : skeletonHeight;
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
      case "fluid":
        return "280px"; // 記事内広告（fluid）
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
    const maxRetries = 10; // 10回に増加（2秒間リトライ）
    let pushed = false;
    let timeoutId: NodeJS.Timeout;

    const tryPushAd = () => {
      try {
        // AdSenseスクリプトが読み込まれているか確認
        if (typeof window === "undefined" || !insRef.current) return;

        const container = insRef.current;

        // コンテナの幅をチェック（display:noneでないことも確認）
        const computedStyle = window.getComputedStyle(container);
        const containerWidth = container.clientWidth;
        const containerOffsetWidth = container.offsetWidth;
        const boundingRect = container.getBoundingClientRect();

        // display:noneの場合はスキップ（レスポンシブ広告の非表示側）
        if (
          computedStyle.display === "none" ||
          computedStyle.visibility === "hidden"
        ) {
          return;
        }

        // 親要素も含めて表示されているかチェック
        let parent = container.parentElement;
        while (parent) {
          const parentStyle = window.getComputedStyle(parent);
          if (
            parentStyle.display === "none" ||
            parentStyle.visibility === "hidden"
          ) {
            return;
          }
          parent = parent.parentElement;
        }

        // 複数の幅チェックを行う - より厳格に
        if (
          containerWidth === 0 ||
          containerOffsetWidth === 0 ||
          boundingRect.width === 0 ||
          boundingRect.height === 0
        ) {
          if (retryCount < maxRetries) {
            retryCount++;
            timeoutId = setTimeout(tryPushAd, 200); // 200msに延長
            return;
          } else {
            // タイムアウト後も失敗の場合はエラーログを出力
            console.warn(
              `AdSense: Container has zero dimensions after ${maxRetries} retries`,
              {
                slot: adSlot,
                width: containerWidth,
                offsetWidth: containerOffsetWidth,
                boundingWidth: boundingRect.width,
                boundingHeight: boundingRect.height,
              }
            );
            return;
          }
        }

        // すでにpushされているかチェック
        if (pushed) {
          return;
        }

        // data-adsbygoogle-status属性をチェック（すでに処理済みか確認）
        if (container.getAttribute("data-adsbygoogle-status")) {
          return;
        }

        // adsbygoogle配列を初期化してpush
        const adsbygoogle = (window.adsbygoogle = window.adsbygoogle || []);

        try {
          adsbygoogle.push({});
          pushed = true;
        } catch (pushErr) {
          console.error("AdSense push error:", pushErr);
          // AdSenseのエラーでもコンポーネントは表示し続ける
          // このエラーは開発環境や一時的な問題の可能性がある
        }
      } catch (err) {
        console.error("AdSense fatal error:", err);
        queueMicrotask(() => {
          setHasError(true);
        });
      }
    };

    // 初回実行は300ms後（スクリプト読み込みとレイアウト完成を待つ）
    timeoutId = setTimeout(tryPushAd, 300);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isMounted, adSlot]);

  // 広告の読み込み状態を監視（本番環境のみ）
  useEffect(() => {
    // 開発環境では広告ブロック検出をスキップ
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    if (!isMounted || !insRef.current) return;

    const container = insRef.current;
    let checkCount = 0;
    const maxChecks = 20; // 10秒間チェック（500ms × 20）

    const checkAdStatus = () => {
      checkCount++;

      // data-adsbygoogle-status属性をチェック
      const status = container.getAttribute("data-adsbygoogle-status");

      if (status === "done") {
        // 広告が正常に読み込まれた
        const adContent = container.querySelector("iframe");
        if (!adContent) {
          // 広告ブロックまたは広告なし
          setShouldHide(true);
        }
      } else if (checkCount < maxChecks) {
        // まだ読み込み中、再チェック
        setTimeout(checkAdStatus, 500);
      } else {
        // タイムアウト - 広告が読み込まれなかった（本番環境でのみ非表示）
        setShouldHide(true);
      }
    };

    // 1秒後にチェック開始（AdSense処理の完了を待つ）
    const timer = setTimeout(checkAdStatus, 1000);

    return () => clearTimeout(timer);
  }, [isMounted]);

  // サーバーサイドレンダリング時はスケルトンを表示
  if (!isMounted) {
    if (!showSkeleton) {
      return null;
    }

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

  // エラー時または非表示時は何も表示しない
  if (hasError || shouldHide) {
    return null;
  }

  // 広告のスタイル：固定サイズの場合のみwidth/heightを設定
  const adStyle: React.CSSProperties =
    width && height
      ? { display: "inline-block", width, height }
      : { display: "block" };

  // コンテナスタイル：固定サイズの場合のみ設定
  // autoやfluidの場合は親要素のサイズに任せる
  const containerStyle: React.CSSProperties | undefined =
    width && height
      ? {
          minWidth: width,
          width: width,
        }
      : undefined;

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
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
