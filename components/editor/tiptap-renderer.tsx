"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { CustomYoutube } from "./extensions/custom-youtube";
import { Instagram } from "./extensions/instagram";
import { CustomImage } from "./extensions/custom-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Heading from "@tiptap/extension-heading";
import { SpeechBubble } from "./extensions/speech-bubble";
import { LinkCard } from "./extensions/link-card";
import { CtaButton } from "./extensions/cta-button";
import { ProductLinkBox } from "./extensions/product-link-box";
import { EmbedAdBox } from "./extensions/embed-ad-box";
import { PointBox } from "./extensions/point-box";
import { ImageGallery } from "./extensions/image-gallery";
import { AffiliateBox } from "./extensions/affiliate-box";
import { LeftHeaderTable } from "./extensions/left-header-table";
import { AdSense } from "../ads/adsense";
import { InlineTableOfContents } from "../post/inline-table-of-contents";

// 見出しの階層的な番号を管理するクラス
class HeadingNumbering {
  private counters: number[] = [0, 0, 0, 0]; // h2, h3, h4, h5用

  generateId(level: number): string {
    // h2=0, h3=1, h4=2, h5=3
    const index = level - 2;

    if (index < 0 || index >= this.counters.length) {
      return `heading-${level}`;
    }

    // 現在のレベルをインクリメント
    this.counters[index]++;

    // より深いレベルをリセット
    for (let i = index + 1; i < this.counters.length; i++) {
      this.counters[i] = 0;
    }

    // 番号を生成（例: 1-2-3）
    const numbers = this.counters.slice(0, index + 1).filter(n => n > 0);
    return `heading-${numbers.join('-')}`;
  }

  reset() {
    this.counters = [0, 0, 0, 0];
  }
}

interface TiptapRendererProps {
  content: string | JSONContent;
  inArticlePcSlots?: (string | undefined)[];  // 最大5つの広告スロット
  inArticleMobileSlots?: (string | undefined)[];  // 最大5つの広告スロット
  className?: string;
}

export function TiptapRenderer({
  content,
  inArticlePcSlots = [],
  inArticleMobileSlots = [],
  className,
}: TiptapRendererProps) {
  // contentをメモ化してパース（文字列の場合のみパースし、再計算を防ぐ）
  const parsedContent = useMemo(() => {
    return typeof content === "string" ? JSON.parse(content) : content;
  }, [content]);

  // 最後のノードが空の段落の場合は削除（メモ化して不要な再計算を防ぐ）
  const cleanedContent = useMemo(() => {
    const cleanContent = (data: JSONContent): JSONContent => {
      if (!data.content || data.content.length === 0) {
        return data;
      }

      const lastNode = data.content[data.content.length - 1];
      
      // 最後のノードが段落で、内容が空またはテキストノードのみで空の場合
      if (lastNode.type === 'paragraph') {
        const hasContent = lastNode.content &&
          lastNode.content.some((node) => {
            if (!node.type) return false;
            if (node.type === 'text' && node.text && node.text.trim()) {
              return true;
            }
            return node.type !== 'text';
          });
        
        // 最後の段落が空で、かつドキュメントに他のコンテンツがある場合は削除
        if (!hasContent && data.content.length > 1) {
          return {
            ...data,
            content: data.content.slice(0, -1)
          };
        }
      }

      return data;
    };

    return cleanContent(parsedContent);
  }, [parsedContent]);

  const [showInArticleAd, setShowInArticleAd] = useState(false);

  // 見出し番号管理インスタンス
  const headingNumbering = new HeadingNumbering();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
          const id = headingNumbering.generateId(level);

          return [`h${level}`, { ...HTMLAttributes, id }, 0];
        },
      }),
      Link.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            class: {
              default: null,
              renderHTML: (attributes) => {
                const href = attributes.href || "";
                const isExternal =
                  href.startsWith("http://") || href.startsWith("https://");
                const isInternalDomain = href.includes("lognote.biz");

                if (isExternal && !isInternalDomain) {
                  return {
                    class:
                      "text-primary underline hover:opacity-80 external-link",
                  };
                }

                return {
                  class: "text-primary underline hover:opacity-80",
                };
              },
            },
          };
        },
      }).configure({
        openOnClick: false,
      }),
      CustomImage.configure({
        inline: false,
        allowBase64: false,
        enableNodeView: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      SpeechBubble.configure({
        HTMLAttributes: {
          class: "speech-bubble",
        },
        enableNodeView: false,
      }),
      LinkCard.configure({
        HTMLAttributes: {
          class: "link-card",
        },
        enableNodeView: false,
      }),
      CtaButton.configure({
        HTMLAttributes: {
          class: "cta-button",
        },
        enableNodeView: false,
      }),
      ProductLinkBox.configure({
        HTMLAttributes: {
          class: "product-link-box",
        },
        enableNodeView: false,
      }),
      EmbedAdBox.configure({
        HTMLAttributes: {
          class: "embed-ad-box",
        },
        enableNodeView: false,
      }),
      PointBox.configure({
        HTMLAttributes: {
          class: "point-box",
        },
        enableNodeView: false,
      }),
      ImageGallery.configure({
        HTMLAttributes: {
          class: "image-gallery",
        },
        enableNodeView: false,
      }),
      LeftHeaderTable.configure({
        HTMLAttributes: {
          class: "left-header-table-wrapper",
        },
        enableNodeView: false,
      }),
      AffiliateBox.configure({
        enableNodeView: false,
      }),
      CustomYoutube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: "rounded-lg my-4",
        },
      }),
      Instagram.configure({
        HTMLAttributes: {
          class: "my-4",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b",
        },
      }),
      TableHeader.extend({
        content: 'inline*',
      }).configure({
        HTMLAttributes: {
          class: "border border-border bg-muted p-2 text-left font-bold",
        },
      }),
      TableCell.extend({
        content: 'inline*',
      }).configure({
        HTMLAttributes: {
          class: "border border-border p-2",
        },
      }),
    ],
    content: cleanedContent,
    editable: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-lg dark:prose-invert mx-auto",
          "prose-headings:font-bold prose-headings:tracking-tight",
          "prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2",
          "prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3",
          "prose-p:leading-relaxed prose-p:mb-4",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          "prose-strong:font-bold prose-strong:text-foreground",
          "prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
          "prose-pre:bg-muted prose-pre:border",
          "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic",
          "prose-ul:list-disc prose-ul:pl-6",
          "prose-ol:list-decimal prose-ol:pl-6",
          "prose-li:mb-2",
          "prose-img:rounded-lg prose-img:shadow-md",
          className
        ),
      },
    },
  });

  // Instagram埋め込みスクリプトを処理
  useEffect(() => {
    if (!editor) return;

    // Instagram埋め込みスクリプトを読み込む
    const loadInstagramScript = () => {
      if (typeof window === "undefined") return;

      const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => {
          // スクリプト読み込み後に埋め込みを処理
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        };
        document.body.appendChild(script);
      } else if (window.instgrm) {
        // スクリプトが既に存在する場合は即座に処理
        window.instgrm.Embeds.process();
      }
    };

    // 少し遅延させて確実に処理
    const timer = setTimeout(() => {
      loadInstagramScript();
    }, 100);

    return () => clearTimeout(timer);
  }, [editor]);

  // H2の数をカウント
  useEffect(() => {
    if (!editor) return;

    const content = editor.getJSON();
    let count = 0;

    const countH2 = (node: JSONContent) => {
      if (node.type === "heading" && node.attrs?.level === 2) {
        count++;
      }
      if (node.content) {
        node.content.forEach(countH2);
      }
    };

    countH2(content);
    const hasAdSlots = inArticlePcSlots.some(slot => slot) || inArticleMobileSlots.some(slot => slot);
    setShowInArticleAd(count >= 2 && hasAdSlots);
  }, [editor, inArticlePcSlots, inArticleMobileSlots]);

  // 最初のH2の前に目次を挿入（遅延実行で確実に挿入）
  useEffect(() => {
    if (!editor) return;

    const insertToc = () => {
      const editorElement = editor.view.dom;
      const h2Elements = editorElement.querySelectorAll("h2");

      if (h2Elements.length > 0) {
        const firstH2 = h2Elements[0];

        // 既に目次が挿入されているかチェック
        const existingToc = document.getElementById("inline-toc-container");
        if (existingToc) return;

        // 目次要素を作成
        const tocContainer = document.createElement("div");
        tocContainer.setAttribute("data-inline-toc", "true");
        tocContainer.className = "not-prose";
        tocContainer.id = "inline-toc-container";

        // H2の前に挿入
        firstH2.parentNode?.insertBefore(tocContainer, firstH2);
      }
    };

    // 即座に実行
    insertToc();

    // 念のため遅延実行も追加（DOM更新を待つ）
    const timer = setTimeout(insertToc, 100);
    const timer2 = setTimeout(insertToc, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [editor]);


  // テーブルを横スクロール可能なラッパーで囲む
  useEffect(() => {
    if (!editor) return;

    const wrappedTables = new WeakSet<HTMLTableElement>();

    const checkScrollable = (wrapper: HTMLElement) => {
      // スクロール可能かどうかをチェック
      const isScrollable = wrapper.scrollWidth > wrapper.clientWidth;
      
      if (isScrollable) {
        wrapper.classList.add('has-scroll');
      } else {
        wrapper.classList.remove('has-scroll');
      }

      // スクロールイベントを監視
      const handleScroll = () => {
        wrapper.classList.add('is-scrolling');
        const wrapperWithTimeout = wrapper as HTMLElement & { _scrollTimeout?: ReturnType<typeof setTimeout> };
        clearTimeout(wrapperWithTimeout._scrollTimeout);
        wrapperWithTimeout._scrollTimeout = setTimeout(() => {
          wrapper.classList.remove('is-scrolling');
        }, 1000);
      };

      wrapper.removeEventListener('scroll', handleScroll);
      wrapper.addEventListener('scroll', handleScroll);
    };

    const wrapTables = () => {
      const editorElement = editor.view.dom;
      const tables = editorElement.querySelectorAll('table');

      tables.forEach((table) => {
        // 既に処理済みのテーブルはスキップ
        if (wrappedTables.has(table as HTMLTableElement)) {
          // ただし、親がラッパーでなくなっている場合は再ラップ
          const parent = table.parentElement;
          if (!parent || (!parent.classList.contains('table-scroll-wrapper') && !parent.classList.contains('tableWrapper'))) {
            wrappedTables.delete(table as HTMLTableElement);
          } else {
            // スクロール可能性を再チェック
            checkScrollable(parent);
            return;
          }
        }

        // 既にラッパーで囲まれているかチェック
        const parent = table.parentElement;
        if (parent && (parent.classList.contains('table-scroll-wrapper') || parent.classList.contains('tableWrapper'))) {
          wrappedTables.add(table as HTMLTableElement);
          checkScrollable(parent);
          return;
        }

        // ラッパー要素を作成
        const wrapper = document.createElement('div');
        wrapper.className = 'table-scroll-wrapper';
        wrapper.setAttribute('data-table-wrapper', 'true');

        // テーブルの前にラッパーを挿入
        table.parentNode?.insertBefore(wrapper, table);

        // テーブルをラッパーの中に移動
        wrapper.appendChild(table);
        
        // 処理済みとしてマーク
        wrappedTables.add(table as HTMLTableElement);

        // スクロール可能性をチェック
        setTimeout(() => checkScrollable(wrapper), 0);
      });
    };

    // 即座に実行
    wrapTables();

    // MutationObserverでDOMの変更を監視
    const editorElement = editor.view.dom;
    const observer = new MutationObserver((mutations) => {
      const hasTableChange = mutations.some(mutation => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          const removedNodes = Array.from(mutation.removedNodes);
          return addedNodes.some(node => 
            node.nodeName === 'TABLE' || 
            (node instanceof Element && node.querySelector('table'))
          ) || removedNodes.some(node =>
            node.nodeName === 'TABLE' ||
            (node instanceof Element && node.querySelector('table'))
          );
        }
        return false;
      });

      if (hasTableChange) {
        wrapTables();
      }
    });

    observer.observe(editorElement, {
      childList: true,
      subtree: true,
    });

    // ResizeObserverでウィンドウサイズの変更を監視
    const resizeObserver = new ResizeObserver(() => {
      const wrappers = editorElement.querySelectorAll('.table-scroll-wrapper, .tableWrapper');
      wrappers.forEach((wrapper) => {
        checkScrollable(wrapper as HTMLElement);
      });
    });

    resizeObserver.observe(editorElement);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [editor]);

  // 2つ目以降のH2の前に広告を挿入（最大5個まで）
  useEffect(() => {
    if (!editor || !showInArticleAd) return;

    const editorElement = editor.view.dom;
    const h2Elements = editorElement.querySelectorAll("h2");

    if (h2Elements.length >= 2) {
      // 2つ目以降のH2に広告を挿入（最大5個まで）
      const maxAds = Math.min(h2Elements.length - 1, 5);

      for (let i = 1; i <= maxAds; i++) {
        const h2 = h2Elements[i];

        // 既に広告が挿入されているかチェック
        const existingAd = h2.previousElementSibling?.querySelector(
          "[data-in-article-ad]"
        );
        if (existingAd) continue;

        // 広告要素を作成
        const adContainer = document.createElement("div");
        adContainer.setAttribute("data-in-article-ad", "true");
        adContainer.setAttribute("data-ad-index", i.toString());
        adContainer.className = "my-10 not-prose";

        // H2の前に挿入
        h2.parentNode?.insertBefore(adContainer, h2);
      }
    }
  }, [editor, showInArticleAd]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative">
      <EditorContent editor={editor} />

      {/* 目次を Portal で挿入 */}
      <InlineTocPortal />

      {/* 記事内広告を Portal で挿入 */}
      {showInArticleAd && (
        <InArticleAdPortal
          pcSlots={inArticlePcSlots}
          mobileSlots={inArticleMobileSlots}
        />
      )}
    </div>
  );
}

// 目次をポータルで挿入するコンポーネント
function InlineTocPortal() {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    // コンテナを探す（複数回試行）
    const findContainer = () => {
      const found = document.getElementById("inline-toc-container");
      if (found) {
        setContainer(found);
        return true;
      }
      return false;
    };

    // 即座に試行
    if (findContainer()) return;

    // 見つからない場合は定期的に再試行
    const interval = setInterval(() => {
      if (findContainer()) {
        clearInterval(interval);
      }
    }, 100);

    // 最大5秒でタイムアウト
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!container) {
    return null;
  }

  return createPortal(
    <InlineTableOfContents />,
    container
  );
}

// 記事内広告をポータルで挿入するコンポーネント
function InArticleAdPortal({
  pcSlots,
  mobileSlots,
}: {
  pcSlots: (string | undefined)[];
  mobileSlots: (string | undefined)[];
}) {
  const [containers, setContainers] = useState<Element[]>([]);

  useEffect(() => {
    // コンテナを探す（複数回試行）
    const findContainers = () => {
      const found = Array.from(document.querySelectorAll(`[data-in-article-ad="true"]`));
      if (found.length > 0) {
        setContainers(found);
        return true;
      }
      return false;
    };

    // 即座に試行
    if (findContainers()) return;

    // 見つからない場合は定期的に再試行
    const interval = setInterval(() => {
      if (findContainers()) {
        clearInterval(interval);
      }
    }, 100);

    // 最大5秒でタイムアウト
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (containers.length === 0) return null;

  // 各広告コンテナにポータルで広告を挿入
  return (
    <>
      {containers.map((container, index) => {
        // 位置に応じた広告スロットを取得（0-indexed）
        const pcSlot = pcSlots[index];
        const mobileSlot = mobileSlots[index];

        // 両方のスロットがない場合はスキップ
        if (!pcSlot && !mobileSlot) return null;

        return createPortal(
          <>
            {/* PC用広告 */}
            {pcSlot && (
              <div
                className="hidden md:block w-full"
                style={{ minWidth: "300px", maxWidth: "100%" }}
              >
                <span className="text-xs text-muted-foreground block text-center mb-2">
                  スポンサーリンク
                </span>
                <AdSense
                  adSlot={pcSlot}
                  adFormat="fluid"
                  fullWidthResponsive={true}
                  layout="in-article"
                  showSkeleton={true}
                  placeholderHeight="300px"
                />
              </div>
            )}
            {/* モバイル用広告 */}
            {mobileSlot && (
              <div className="block md:hidden">
                <span className="text-xs text-muted-foreground block text-center mb-1">
                  スポンサーリンク
                </span>
                <div className="flex justify-center">
                  <AdSense
                    adSlot={mobileSlot}
                    width="300px"
                    height="250px"
                    adFormat="rectangle"
                    fullWidthResponsive={false}
                    showSkeleton={true}
                  />
                </div>
              </div>
            )}
          </>,
          container,
          `in-article-ad-${index}`
        );
      })}
    </>
  );
}

// Instagram埋め込みスクリプトのグローバル型定義
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
