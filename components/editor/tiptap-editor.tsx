"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline as TiptapUnderline } from "@tiptap/extension-underline";
import { SpeechBubble } from "./extensions/speech-bubble";
import { LinkCard } from "./extensions/link-card";
import { Button } from "@/components/ui/button";

// 一意の名前でUnderline拡張を作成（重複警告を回避）
const Underline = TiptapUnderline.extend({
  name: 'underlineEditor',
});
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading2,
  Heading3,
  Heading4,
  Link2,
  ImageIcon,
  Undo,
  Redo,
  RemoveFormatting,
  Underline as UnderlineIcon,
  MessageSquare,
  MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImagePickerDialog } from "./image-picker-dialog";
import { LinkDialog } from "./link-dialog";

interface TiptapEditorProps {
  content: JSONContent | null;
  onChange: (content: JSONContent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "記事の本文を入力してください...",
  disabled = false,
}: TiptapEditorProps) {
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [, forceUpdate] = useState({});

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
        link: false, // Link拡張を無効化して、後で個別に設定
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      SpeechBubble.configure({
        enableNodeView: true,
      }),
      LinkCard.configure({
        enableNodeView: true,
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
    onSelectionUpdate: () => {
      // カーソル位置が変わったらツールバーの状態を更新
      forceUpdate({});
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose lg:prose-lg dark:prose-invert",
          "!max-w-none focus:outline-none min-h-[400px] px-8 py-6",
          "prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2",
          "prose-h3:text-xl prose-h3:font-bold prose-h3:mt-6 prose-h3:mb-3",
          "prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-4 prose-h4:mb-2"
        ),
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        // クリップボードに画像があるかチェック
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.indexOf('image') !== -1) {
            event.preventDefault();
            const file = item.getAsFile();
            if (file) {
              // 画像をアップロード
              const formData = new FormData();
              formData.append('file', file);

              fetch('/api/upload', {
                method: 'POST',
                body: formData,
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.url) {
                    // 画像を挿入
                    view.dispatch(
                      view.state.tr.replaceSelectionWith(
                        view.state.schema.nodes.image.create({ src: data.url })
                      )
                    );
                  }
                })
                .catch((error) => {
                  console.error('Failed to upload image:', error);
                  alert('画像のアップロードに失敗しました');
                });
            }
            return true;
          }
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    setLinkDialogOpen(true);
  };

  const addImage = () => {
    setImageDialogOpen(true);
  };

  const handleImageSelect = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
  };

  const handleLinkInsert = async (data: {
    href: string;
    text?: string;
    type: "simple" | "card";
    linkTarget?: "internal" | "external";
  }) => {
    if (data.type === "simple") {
      // 通常のリンク（内部・外部両方対応）
      if (data.text) {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${data.href}">${data.text}</a>`)
          .run();
      } else {
        editor.chain().focus().setLink({ href: data.href }).run();
      }
    } else {
      // リンクカード（内部リンク専用）
      // APIからデータを取得して保存
      const fetchAndInsertLinkCard = async () => {
        try {
          const slug = data.href.startsWith("/") ? data.href.slice(1) : data.href;
          const response = await fetch(`/api/posts/by-slug?slug=${slug}`);

          if (response.ok) {
            const postData = await response.json();
            editor
              .chain()
              .focus()
              .setLinkCard({
                href: data.href,
                title: postData.title,
                description: postData.description,
              })
              .run();
          } else {
            // データ取得失敗時はhrefのみで挿入
            editor
              .chain()
              .focus()
              .setLinkCard({
                href: data.href,
              })
              .run();
          }
        } catch (error) {
          console.error("Failed to fetch link card data:", error);
          // エラー時もhrefのみで挿入
          editor
            .chain()
            .focus()
            .setLinkCard({
              href: data.href,
            })
            .run();
        }
      };

      fetchAndInsertLinkCard();
    }
  };

  return (
    <>
      <div className="rounded-md border">
        {/* ツールバー */}
        <div className="sticky top-0 z-40 flex flex-wrap gap-1 rounded-t-[calc(0.375rem-1px)] border-b bg-muted p-2 shadow-sm">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 })
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 })
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={
              editor.isActive("heading", { level: 4 })
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
          >
            <Heading4 className="h-4 w-4" />
          </Button>
          <div className="mx-1 w-px bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive("bold") ? "bg-accent border-2 border-primary" : ""
            }
            disabled={disabled}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive("italic")
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={
              editor.isActive("underline")
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <div className="mx-1 w-px bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setColor("#dc2626").run()}
            className={
              editor.isActive("textStyle", { color: "#dc2626" })
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
            title="赤色"
          >
            <span className="h-4 w-4 flex items-center justify-center font-bold text-red-600">
              A
            </span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setColor("#2563eb").run()}
            className={
              editor.isActive("textStyle", { color: "#2563eb" })
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
            title="青色"
          >
            <span className="h-4 w-4 flex items-center justify-center font-bold text-blue-600">
              A
            </span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              const { from, to } = editor.state.selection;
              if (from === to) {
                // 選択範囲がない場合は、現在のブロック全体を選択してクリア
                editor
                  .chain()
                  .focus()
                  .selectParentNode()
                  .clearNodes()
                  .unsetAllMarks()
                  .unsetColor()
                  .run();
              } else {
                // 選択範囲がある場合は、その範囲をクリア
                editor
                  .chain()
                  .focus()
                  .clearNodes()
                  .unsetAllMarks()
                  .unsetColor()
                  .run();
              }
            }}
            disabled={disabled}
            title="装飾解除"
          >
            <RemoveFormatting className="h-4 w-4" />
          </Button>
          <div className="mx-1 w-px bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList")
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive("orderedList")
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={
              editor.isActive("blockquote")
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={
              editor.isActive("codeBlock")
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
          >
            <Code className="h-4 w-4" />
          </Button>
          <div className="mx-1 w-px bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleSpeechBubble("left").run()}
            className={
              editor.isActive("speechBubble", { position: "left" })
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
            title="吹き出し（左）"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleSpeechBubble("right").run()}
            className={
              editor.isActive("speechBubble", { position: "right" })
                ? "bg-accent border-2 border-primary"
                : ""
            }
            disabled={disabled}
            title="吹き出し（右）"
          >
            <MessageSquareText className="h-4 w-4" />
          </Button>
          <div className="mx-1 w-px bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addLink}
            className={
              editor.isActive("link") ? "bg-accent border-2 border-primary" : ""
            }
            disabled={disabled}
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
            disabled={disabled}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <div className="mx-1 w-px bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo() || disabled}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo() || disabled}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* エディタエリア */}
        <EditorContent editor={editor} />
      </div>

      <ImagePickerDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onSelect={handleImageSelect}
      />
      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onInsert={handleLinkInsert}
      />
    </>
  );
}
