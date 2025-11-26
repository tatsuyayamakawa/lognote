"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Highlight } from "@tiptap/extension-highlight"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import Heading from "@tiptap/extension-heading"

// 見出しにIDを自動生成する関数
function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

interface TiptapRendererWithAdsProps {
  content: any
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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
        heading: false, // デフォルトのHeadingを無効化
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0]
          const text = node.textContent
          const id = generateId(text)

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

    const countH2 = (node: any) => {
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
    if (container && container.children.length === 0) {
      // PC用広告
      if (pcSlot) {
        const pcDiv = document.createElement("div")
        pcDiv.className = "hidden md:block text-center"

        // スポンサーリンクラベル
        const pcLabel = document.createElement("span")
        pcLabel.className = "text-xs text-muted-foreground block mb-1"
        pcLabel.textContent = "スポンサーリンク"
        pcDiv.appendChild(pcLabel)

        const pcIns = document.createElement("ins")
        pcIns.className = "adsbygoogle"
        pcIns.style.display = "block"
        pcIns.style.textAlign = "center"
        pcIns.setAttribute("data-ad-client", "ca-pub-7839828582645189")
        pcIns.setAttribute("data-ad-slot", pcSlot)
        pcIns.setAttribute("data-ad-format", "fluid")
        pcIns.setAttribute("data-full-width-responsive", "true")
        pcDiv.appendChild(pcIns)
        container.appendChild(pcDiv)
      }

      // モバイル用広告
      if (mobileSlot) {
        const mobileDiv = document.createElement("div")
        mobileDiv.className = "block md:hidden text-center"

        // スポンサーリンクラベル
        const mobileLabel = document.createElement("span")
        mobileLabel.className = "text-xs text-muted-foreground block mb-1"
        mobileLabel.textContent = "スポンサーリンク"
        mobileDiv.appendChild(mobileLabel)

        const mobileIns = document.createElement("ins")
        mobileIns.className = "adsbygoogle"
        mobileIns.style.display = "inline-block"
        mobileIns.style.width = "300px"
        mobileIns.style.height = "250px"
        mobileIns.setAttribute("data-ad-client", "ca-pub-7839828582645189")
        mobileIns.setAttribute("data-ad-slot", mobileSlot)
        mobileDiv.appendChild(mobileIns)
        container.appendChild(mobileDiv)
      }

      // AdSense スクリプトを実行
      try {
        ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
        if (pcSlot) {
          ;(window as any).adsbygoogle.push({})
        }
        if (mobileSlot) {
          ;(window as any).adsbygoogle.push({})
        }
      } catch (err) {
        console.error("AdSense error:", err)
      }
    }
  }, [mounted, pcSlot, mobileSlot])

  return null
}
