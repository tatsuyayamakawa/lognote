"use client"

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Highlight } from "@tiptap/extension-highlight"
import Underline from "@tiptap/extension-underline"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Heading from "@tiptap/extension-heading"
import { SpeechBubble } from "./extensions/speech-bubble"
import { LinkCard } from "./extensions/link-card"
import { AdSense } from "../ads/adsense"

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

interface TiptapRendererWithAdsProps {
  content: string | JSONContent
  inArticlePcSlot?: string
  inArticleMobileSlot?: string
  className?: string
}

export function TiptapRendererWithAds({
  content,
  inArticlePcSlot,
  inArticleMobileSlot,
  className,
}: TiptapRendererWithAdsProps) {
  const parsedContent =
    typeof content === "string" ? JSON.parse(content) : content

  const [showInArticleAd, setShowInArticleAd] = useState(false)

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
            : this.options.levels[0]
          const id = headingNumbering.generateId(level)

          return [
            `h${level}`,
            { ...HTMLAttributes, id },
            0,
          ]
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: "text-primary underline hover:opacity-80",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
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
  })

  // H2の数をカウント
  useEffect(() => {
    if (!editor) return

    const content = editor.getJSON()
    let count = 0

    const countH2 = (node: JSONContent) => {
      if (node.type === "heading" && node.attrs?.level === 2) {
        count++
      }
      if (node.content) {
        node.content.forEach(countH2)
      }
    }

    countH2(content)
    setShowInArticleAd(count >= 2 && !!(inArticlePcSlot || inArticleMobileSlot))
  }, [editor, inArticlePcSlot, inArticleMobileSlot])

  // 2つ目のH2の前に広告を挿入
  useEffect(() => {
    if (!editor || !showInArticleAd) return

    const editorElement = editor.view.dom
    const h2Elements = editorElement.querySelectorAll("h2")

    if (h2Elements.length >= 2) {
      const secondH2 = h2Elements[1]

      // 既に広告が挿入されているかチェック
      const existingAd = secondH2.previousElementSibling?.querySelector("[data-in-article-ad]")
      if (existingAd) return

      // 広告要素を作成
      const adContainer = document.createElement("div")
      adContainer.setAttribute("data-in-article-ad", "true")
      adContainer.className = "my-10 not-prose"
      adContainer.id = "in-article-ad-container"

      // H2の前に挿入
      secondH2.parentNode?.insertBefore(adContainer, secondH2)
    }
  }, [editor, showInArticleAd])

  if (!editor) {
    return null
  }

  return (
    <div className="relative">
      <EditorContent editor={editor} />

      {/* 記事内広告を Portal で挿入 */}
      {showInArticleAd && (inArticlePcSlot || inArticleMobileSlot) && (
        <InArticleAdPortal
          pcSlot={inArticlePcSlot}
          mobileSlot={inArticleMobileSlot}
        />
      )}
    </div>
  )
}

// 記事内広告をポータルで挿入するコンポーネント
function InArticleAdPortal({
  pcSlot,
  mobileSlot,
}: {
  pcSlot?: string
  mobileSlot?: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const container = document.querySelector(`[data-in-article-ad="true"]`)
    if (!container) return

    // すでに広告が挿入されているかチェック
    if (container.hasAttribute("data-ad-inserted")) return

    // 広告挿入済みフラグを設定
    container.setAttribute("data-ad-inserted", "true")
  }, [mounted, pcSlot, mobileSlot])

  if (!mounted) return null

  const container = document.querySelector(`[data-in-article-ad="true"]`)
  if (!container) return null

  return createPortal(
    <>
      {/* PC用広告 */}
      {pcSlot && (
        <div className="hidden md:block text-center">
          <span className="text-xs text-muted-foreground block mb-1">
            スポンサーリンク
          </span>
          <AdSense
            adSlot={pcSlot}
            adFormat="fluid"
            fullWidthResponsive={true}
            showSkeleton={false}
          />
        </div>
      )}
      {/* モバイル用広告 */}
      {mobileSlot && (
        <div className="block md:hidden text-center">
          <span className="text-xs text-muted-foreground block mb-1">
            スポンサーリンク
          </span>
          <AdSense
            adSlot={mobileSlot}
            width="300px"
            height="250px"
            adFormat="rectangle"
            fullWidthResponsive={false}
            showSkeleton={false}
          />
        </div>
      )}
    </>,
    container
  )
}
