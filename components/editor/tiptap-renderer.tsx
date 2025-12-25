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
import { useEffect, useState } from "react";
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
  inArticlePcSlot?: string;
  inArticleMobileSlot?: string;
  className?: string;
}

export function TiptapRenderer({
  content,
  inArticlePcSlot,
  inArticleMobileSlot,
  className,
}: TiptapRendererProps) {
  const parsedContent =
    typeof content === "string" ? JSON.parse(content) : content;

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
    content: parsedContent,
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
    setShowInArticleAd(
      count >= 2 && !!(inArticlePcSlot || inArticleMobileSlot)
    );
  }, [editor, inArticlePcSlot, inArticleMobileSlot]);

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

  // 2つ目のH2の前に広告を挿入
  useEffect(() => {
    if (!editor || !showInArticleAd) return;

    const editorElement = editor.view.dom;
    const h2Elements = editorElement.querySelectorAll("h2");

    if (h2Elements.length >= 2) {
      const secondH2 = h2Elements[1];

      // 既に広告が挿入されているかチェック
      const existingAd = secondH2.previousElementSibling?.querySelector(
        "[data-in-article-ad]"
      );
      if (existingAd) return;

      // 広告要素を作成
      const adContainer = document.createElement("div");
      adContainer.setAttribute("data-in-article-ad", "true");
      adContainer.className = "my-10 not-prose";
      adContainer.id = "in-article-ad-container";

      // H2の前に挿入
      secondH2.parentNode?.insertBefore(adContainer, secondH2);
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
      {showInArticleAd && (inArticlePcSlot || inArticleMobileSlot) && (
        <InArticleAdPortal
          pcSlot={inArticlePcSlot}
          mobileSlot={inArticleMobileSlot}
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
  pcSlot,
  mobileSlot,
}: {
  pcSlot?: string;
  mobileSlot?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 次のイベントループでマウント状態を更新（同期的なsetStateを回避）
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const container = document.querySelector(`[data-in-article-ad="true"]`);
    if (!container) return;

    // すでに広告が挿入されているかチェック
    if (container.hasAttribute("data-ad-inserted")) return;

    // 広告挿入済みフラグを設定
    container.setAttribute("data-ad-inserted", "true");
  }, [mounted, pcSlot, mobileSlot]);

  if (!mounted) return null;

  const container = document.querySelector(`[data-in-article-ad="true"]`);
  if (!container) return null;

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
    container
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
