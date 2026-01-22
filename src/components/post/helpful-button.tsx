"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

interface HelpfulButtonProps {
  postId: string;
  initialCount?: number;
}

export function HelpfulButton({ postId, initialCount = 0 }: HelpfulButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // LocalStorageから既にクリックしたかチェック
    const storageKey = `helpful-${postId}`;
    const clicked = localStorage.getItem(storageKey);
    if (clicked === "true") {
      setIsClicked(true);
    }

    const currentContainer = containerRef.current;

    // Intersection Observerでボタンの表示を制御（スマホのみ）
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // ボタン位置が見えたら表示開始
            setIsVisible(true);
          } else {
            // ボタン位置が見えなくなったら非表示（上にスクロールした場合）
            if (containerRef.current) {
              const rect = containerRef.current.getBoundingClientRect();
              // 上方向にスクロールアウトした場合のみ非表示
              if (rect.bottom < 0) {
                setIsVisible(false);
              }
            }
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -200px 0px", // 下から200px手前で検出
      }
    );

    // スクロールイベントでフッター到達を検出
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollBottom = scrollTop + windowHeight;

      // ページ最下部まで150px以内ならボタンを非表示
      if (documentHeight - scrollBottom < 150) {
        setIsVisible(false);
      } else if (containerRef.current) {
        // ボタン位置が見えているかチェック
        const rect = containerRef.current.getBoundingClientRect();
        const isInView = rect.top < windowHeight - 200 && rect.bottom > 0;
        setIsVisible(isInView);
      }
    };

    if (currentContainer) {
      observer.observe(currentContainer);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [postId]);

  const handleClick = async () => {
    if (isClicked || isLoading) return;

    setIsLoading(true);

    try {
      // セッションIDの生成（なければ新規作成）
      let sessionId = localStorage.getItem("session-id");
      if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        localStorage.setItem("session-id", sessionId);
      }

      const response = await fetch("/api/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCount(data.count);
        setIsClicked(true);
        setShowAnimation(true);
        setShowTooltip(true);
        localStorage.setItem(`helpful-${postId}`, "true");

        // キャラクターアニメーションとツールチップを4秒後に非表示
        setTimeout(() => {
          setShowAnimation(false);
          setShowTooltip(false);
        }, 4000);
      } else {
        // エラーハンドリング
        if (data.error === "already_reacted") {
          setIsClicked(true);
          localStorage.setItem(`helpful-${postId}`, "true");
        } else {
          alert(data.message || "エラーが発生しました。しばらくしてから再度お試しください。");
        }
      }
    } catch (error) {
      console.error("Error submitting reaction:", error);
      alert("エラーが発生しました。しばらくしてから再度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* デスクトップ表示（通常配置） */}
      <div ref={containerRef} className="my-12 hidden md:flex justify-center">
        <div className="relative">
          <Button
            onClick={handleClick}
            disabled={isClicked || isLoading}
            size="lg"
            className={`group relative min-w-[200px] overflow-visible text-base font-semibold transition-all ${isClicked
              ? "bg-muted/80 border-2 border-muted-foreground/30 text-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
          >
            <span className={`relative flex items-center gap-2 ${isClicked ? "text-muted-foreground" : ""}`}>
              <span className="relative inline-block">
                <ThumbsUp
                  className={`h-5 w-5 transition-all duration-300 ${isClicked ? "text-muted-foreground" : ""} ${showAnimation
                    ? "animate-[bounce_0.6s_ease-in-out]"
                    : isClicked
                      ? "scale-110"
                      : "group-hover:scale-110"
                    }`}
                  style={{
                    animation: showAnimation
                      ? "thumbsUpBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
                      : undefined
                  }}
                />
                {showAnimation && (
                  <>
                    <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-yellow-400 animate-ping" />
                    <span className="absolute -top-1 -left-1 h-1 w-1 rounded-full bg-yellow-400 animate-ping" style={{ animationDelay: "0.1s" }} />
                    <span className="absolute -bottom-1 -right-1 h-1 w-1 rounded-full bg-yellow-400 animate-ping" style={{ animationDelay: "0.2s" }} />
                  </>
                )}
              </span>
              {isClicked ? "参考になった！" : "参考になった"}
              {count > 0 && (
                <span className={`ml-1 rounded-full px-2.5 py-0.5 text-sm font-bold ${isClicked ? "bg-muted-foreground/20 text-muted-foreground" : "bg-primary-foreground/20"
                  }`}>
                  {count.toLocaleString()}
                </span>
              )}
            </span>
          </Button>

          {/* キャラクターアニメーション（カウント上から登場） */}
          {showAnimation && (
            <div className="absolute -top-6 -right-2 animate-in slide-in-from-bottom-4 fade-in zoom-in duration-500 pointer-events-none">
              <div className="relative animate-wiggle">
                <span className="text-4xl block animate-wave">👋</span>
              </div>
            </div>
          )}

          {/* ツールチップ風のサンクスメッセージ */}
          {showTooltip && (
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-300">
              <div className="relative bg-primary text-primary-foreground px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                <p className="text-xs font-medium">ありがとうございます！</p>
                {/* 下向き三角形 */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* スマホ表示用の目印要素 */}
      <div ref={containerRef} className="my-12 md:hidden">
        {/* Intersection Observer用の目印（この要素が見えたらボタンを表示） */}
        <div className="h-1" />
      </div>

      {/* スマホ用フローティングボタン */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out ${isVisible ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="bg-background/95 backdrop-blur-sm border-t shadow-lg p-4">
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm">
              <Button
                onClick={handleClick}
                disabled={isClicked || isLoading}
                size="lg"
                className={`group relative w-full overflow-visible text-base font-semibold transition-all ${isClicked
                  ? "bg-muted/80 border-2 border-muted-foreground/30 text-muted-foreground cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
              >
                <span className={`relative flex items-center gap-2 ${isClicked ? "text-muted-foreground" : ""}`}>
                  <span className="relative inline-block">
                    <ThumbsUp
                      className={`h-5 w-5 transition-all duration-300 ${isClicked ? "text-muted-foreground" : ""} ${showAnimation
                        ? "animate-[bounce_0.6s_ease-in-out]"
                        : isClicked
                          ? "scale-110"
                          : "group-hover:scale-110"
                        }`}
                      style={{
                        animation: showAnimation
                          ? "thumbsUpBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
                          : undefined
                      }}
                    />
                    {showAnimation && (
                      <>
                        <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-yellow-400 animate-ping" />
                        <span className="absolute -top-1 -left-1 h-1 w-1 rounded-full bg-yellow-400 animate-ping" style={{ animationDelay: "0.1s" }} />
                        <span className="absolute -bottom-1 -right-1 h-1 w-1 rounded-full bg-yellow-400 animate-ping" style={{ animationDelay: "0.2s" }} />
                      </>
                    )}
                  </span>
                  {isClicked ? "参考になった！" : "参考になった"}
                  {count > 0 && (
                    <span className={`ml-1 rounded-full px-2.5 py-0.5 text-sm font-bold ${isClicked ? "bg-muted-foreground/20 text-muted-foreground" : "bg-primary-foreground/20"
                      }`}>
                      {count.toLocaleString()}
                    </span>
                  )}
                </span>
              </Button>

              {/* キャラクターアニメーション（カウント上から登場・スマホ） */}
              {showAnimation && (
                <div className="absolute -top-6 -right-2 animate-in slide-in-from-bottom-4 fade-in zoom-in duration-500 pointer-events-none">
                  <div className="relative animate-wiggle">
                    <span className="text-4xl block animate-wave">👋</span>
                  </div>
                </div>
              )}

              {/* ツールチップ風のサンクスメッセージ（スマホ） */}
              {showTooltip && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-300">
                  <div className="relative bg-primary text-primary-foreground px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                    <p className="text-xs font-medium">ありがとうございます！</p>
                    {/* 下向き三角形 */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* カスタムアニメーション定義 */}
      <style jsx>{`
        @keyframes thumbsUpBounce {
          0% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.3) rotate(-10deg);
          }
          50% {
            transform: scale(1.4) rotate(5deg);
          }
          75% {
            transform: scale(1.2) rotate(-5deg);
          }
          100% {
            transform: scale(1.1) rotate(0deg);
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-15deg);
          }
          75% {
            transform: rotate(15deg);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: rotate(20deg);
          }
          20%, 40%, 60%, 80% {
            transform: rotate(-15deg);
          }
        }

        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out 2;
        }

        .animate-wave {
          animation: wave 1s ease-in-out;
          transform-origin: 70% 70%;
        }
      `}</style>
    </>
  );
}
