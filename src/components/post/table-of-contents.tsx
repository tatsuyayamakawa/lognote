"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const tocListRef = useRef<HTMLUListElement | null>(null);

  // 見出しを抽出（MutationObserverで動的に監視）
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

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

  // Intersection Observer でアクティブな見出しを追跡
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 1,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  // アクティブな項目が変わったら目次内でスクロール
  useEffect(() => {
    if (!activeId || !tocListRef.current) return;

    const activeElement = tocListRef.current.querySelector(
      `a[href="#${activeId}"]`
    )?.parentElement;

    if (activeElement) {
      const tocList = tocListRef.current;
      const tocListRect = tocList.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      // 目次リストの相対位置を計算
      const relativeTop = activeRect.top - tocListRect.top + tocList.scrollTop;
      const relativeBottom = relativeTop + activeRect.height;

      // 現在のスクロール範囲
      const scrollTop = tocList.scrollTop;
      const scrollBottom = scrollTop + tocList.clientHeight;

      // 要素が見えていない場合、スクロール
      if (relativeTop < scrollTop) {
        // 上にスクロール
        tocList.scrollTo({
          top: relativeTop - 20, // 余白を持たせる
          behavior: "smooth",
        });
      } else if (relativeBottom > scrollBottom) {
        // 下にスクロール
        tocList.scrollTo({
          top: relativeBottom - tocList.clientHeight + 20, // 余白を持たせる
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

  // クリックハンドラ
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80; // ヘッダーの高さ分のオフセット
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    []
  );

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={cn("space-y-1", className)}>
      <p className="mb-4 text-base font-bold text-foreground">目次</p>
      <ul ref={tocListRef} className="space-y-1 text-sm max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-primary/50">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              "border-l-2 transition-all duration-200",
              heading.level === 3 && "pl-4",
              heading.level === 4 && "pl-8",
              activeId === heading.id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-accent"
            )}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={cn(
                "block py-2 px-3 transition-colors",
                activeId === heading.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
