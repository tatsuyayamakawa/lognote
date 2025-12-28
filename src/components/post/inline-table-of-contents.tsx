"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface InlineTableOfContentsProps {
  className?: string;
}

export function InlineTableOfContents({ className }: InlineTableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [maxHeight, setMaxHeight] = useState<string>("200px");

  // 見出しを抽出（MutationObserverで動的に監視）
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) {
      return;
    }

    const extractHeadings = () => {
      // Tiptapのエディターコンテンツ内の見出しを取得（h2, h3, h4）
      const headingElements = article.querySelectorAll(".ProseMirror h2, .ProseMirror h3, .ProseMirror h4");
      const headingData: Heading[] = Array.from(headingElements).map(
        (heading) => {
          return {
            id: heading.id,
            text: heading.textContent || "",
            level: parseInt(heading.tagName.charAt(1)),
          };
        }
      );

      if (headingData.length > 0) {
        setHeadings(headingData);
      }
    };

    // 初回抽出
    extractHeadings();

    // MutationObserverでDOMの変更を監視
    const observer = new MutationObserver(() => {
      extractHeadings();
    });

    observer.observe(article, {
      childList: true,
      subtree: true,
    });

    // 念のため遅延実行も追加
    const timer = setTimeout(extractHeadings, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // 目次の高さをチェックして開閉ボタンの表示を決定
  useEffect(() => {
    const checkHeight = () => {
      const tocElement = document.getElementById("inline-toc-list");
      if (tocElement) {
        const actualHeight = tocElement.scrollHeight;
        // 200px以上の場合、開閉ボタンを表示
        setShouldShowButton(actualHeight > 200);
        // 実際の高さを保存（アニメーション用）
        setMaxHeight(`${actualHeight}px`);
      }
    };

    // 見出しが変わったらチェック
    checkHeight();
    // リサイズ時にもチェック
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, [headings]);

  // クリックハンドラ
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // ヘッダーの高さ分のオフセット
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={cn("mb-8 bg-card rounded-lg border shadow-sm", className)}>
      <div className="p-6 pb-4">
        <p className="mt-0! text-lg font-bold text-foreground mb-4">目次</p>

        <div className="relative">
          {/* 目次リスト */}
          <ul
            id="inline-toc-list"
            className="space-y-2 text-sm transition-all duration-500 ease-in-out overflow-hidden"
            style={{
              maxHeight: shouldShowButton && !isExpanded ? "200px" : maxHeight,
            }}
          >
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={cn(
                  "border-l-2 border-border transition-all duration-200 hover:border-primary/50",
                  heading.level === 3 && "pl-4",
                  heading.level === 4 && "pl-8"
                )}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className="block py-1.5 px-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>

          {/* フェードエフェクト（閉じている時のみ） */}
          {shouldShowButton && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-card via-card/90 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* 開閉ボタン（下中央） */}
      {shouldShowButton && (
        <div className="border-t">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 flex items-center justify-center gap-1 text-sm text-primary hover:text-primary/80 hover:bg-accent/50 transition-colors font-medium"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "目次を閉じる" : "目次を開く"}
          >
            {isExpanded ? (
              <>
                <span>閉じる</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>目次を開く</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </nav>
  );
}
