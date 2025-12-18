"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { SpeechBubble } from "./extensions/speech-bubble";
import { LinkCard } from "./extensions/link-card";
import { CtaButton } from "./extensions/cta-button";
import { ProductLinkBox } from "./extensions/product-link-box";
import { EmbedAdBox } from "./extensions/embed-ad-box";
import { PointBox } from "./extensions/point-box";
import { AffiliateBox } from "./extensions/affiliate-box";
import { ImageGallery } from "./extensions/image-gallery";
import { CustomImage } from "./extensions/custom-image";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
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
  MousePointerClick,
  Table as TableIcon,
  Columns,
  Rows,
  Trash2,
  Package,
  MonitorPlay,
  Youtube as YoutubeIcon,
  Lightbulb,
  Images,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImagePickerDialog } from "./dialogs/image-picker-dialog";
import { LinkDialog } from "./dialogs/link-dialog";
import { ColorPickerPopover } from "./dialogs/color-picker-popover";
import { SpeechBubbleDialog } from "./dialogs/speech-bubble-dialog";
import { CtaButtonDialog } from "./dialogs/cta-button-dialog";
import { PointBoxDialog } from "./dialogs/point-box-dialog";
import { ProductLinkBoxDialog } from "./dialogs/product-link-box-dialog";
import { EmbedAdBoxDialog } from "./dialogs/embed-ad-box-dialog";
import { YoutubePopover } from "./dialogs/youtube-popover";
import { ImageGalleryDialog } from "./dialogs/image-gallery-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [imageInitialData, setImageInitialData] = useState<{ src: string; alt?: string; caption?: string } | undefined>(undefined);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [speechBubbleDialogOpen, setSpeechBubbleDialogOpen] = useState(false);
  const [ctaButtonDialogOpen, setCtaButtonDialogOpen] = useState(false);
  const [productLinkBoxDialogOpen, setProductLinkBoxDialogOpen] = useState(false);
  const [embedAdBoxDialogOpen, setEmbedAdBoxDialogOpen] = useState(false);
  const [youtubePopoverOpen, setYoutubePopoverOpen] = useState(false);
  const [pointBoxDialogOpen, setPointBoxDialogOpen] = useState(false);
  const [imageGalleryDialogOpen, setImageGalleryDialogOpen] = useState(false);
  const [linkInitialData, setLinkInitialData] = useState<{ href: string; text?: string } | undefined>(undefined);
  const [ctaButtonInitialData, setCtaButtonInitialData] = useState<{
    href: string;
    text: string;
    variant: 'primary' | 'secondary' | 'outline';
    bgColor?: string;
    textColor?: string;
    animation?: 'none' | 'pulse' | 'bounce' | 'shine' | 'glow';
  } | undefined>(undefined);
  const [isEditingCtaButton, setIsEditingCtaButton] = useState(false);
  const [productLinkBoxInitialData, setProductLinkBoxInitialData] = useState<{
    productName?: string;
    productImage?: string;
    amazonUrl?: string;
    amazonPrice?: string;
    rakutenUrl?: string;
    rakutenPrice?: string;
    yahooUrl?: string;
    yahooPrice?: string;
  } | undefined>(undefined);
  const [isEditingProductLinkBox, setIsEditingProductLinkBox] = useState(false);
  const [imageGalleryInitialData, setImageGalleryInitialData] = useState<{
    images: { src: string; alt?: string; caption?: string }[];
    columns: number;
    gap: number;
  } | undefined>(undefined);
  const [isEditingImageGallery, setIsEditingImageGallery] = useState(false);
  const [embedAdBoxInitialData, setEmbedAdBoxInitialData] = useState<{
    embedCode: string;
  } | undefined>(undefined);
  const [isEditingEmbedAdBox, setIsEditingEmbedAdBox] = useState(false);
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
      Link.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            class: {
              default: null,
              renderHTML: (attributes) => {
                const href = attributes.href || "";
                const isExternal = href.startsWith("http://") || href.startsWith("https://");
                const isInternalDomain = href.includes("lognote.biz");

                if (isExternal && !isInternalDomain) {
                  return {
                    class: "text-primary underline cursor-pointer external-link",
                  };
                }

                return {
                  class: "text-primary underline cursor-pointer",
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
        enableNodeView: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: "rounded-lg my-4",
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
      SpeechBubble.configure({
        enableNodeView: true,
      }),
      LinkCard.configure({
        enableNodeView: true,
      }),
      CtaButton.configure({
        enableNodeView: true,
      }),
      ProductLinkBox.configure({
        enableNodeView: true,
      }),
      EmbedAdBox.configure({
        enableNodeView: true,
      }),
      PointBox.configure({
        enableNodeView: true,
      }),
      AffiliateBox.configure({
        enableNodeView: true,
      }),
      ImageGallery.configure({
        enableNodeView: true,
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
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border bg-muted p-2 text-left font-bold",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border p-2",
        },
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
    onCreate: ({ editor }) => {
      // エディタ作成時にクリックイベントを追加
      const editorElement = editor.view.dom;

      editorElement.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;

        // リンクがクリックされた場合
        const linkElement = target.closest('a');

        if (linkElement && !disabled) {
          // 埋め込み広告ボックス内のリンクかチェック
          const embedAdBox = linkElement.closest('[data-embed-ad-box]');
          if (embedAdBox) {
            // 埋め込み広告ボックス内のリンクは編集ダイアログを開かない
            return;
          }

          event.preventDefault();
          const href = linkElement.getAttribute('href') || '';
          const text = linkElement.textContent || '';

          setLinkInitialData({ href, text });
          setLinkDialogOpen(true);
          return;
        }
      });
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
                .then(async (res) => {
                  const data = await res.json();
                  if (!res.ok) {
                    throw new Error(data.error || 'アップロードに失敗しました');
                  }
                  return data;
                })
                .then((data) => {
                  if (data.url) {
                    // 画像を挿入
                    view.dispatch(
                      view.state.tr.replaceSelectionWith(
                        view.state.schema.nodes.image.create({ src: data.url })
                      )
                    );
                  } else {
                    throw new Error('画像URLが取得できませんでした');
                  }
                })
                .catch((error) => {
                  console.error('Failed to upload image:', error);
                  alert(error instanceof Error ? error.message : '画像のアップロードに失敗しました');
                });
            }
            return true;
          }
        }
        return false;
      },
      handleDrop(view, event, _slice, moved) {
        if (moved) return false;

        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        // ドロップされたファイルに画像があるかチェック
        const imageFile = Array.from(files).find((file) =>
          file.type.startsWith('image/')
        );

        if (imageFile) {
          event.preventDefault();

          // 画像をアップロード
          const formData = new FormData();
          formData.append('file', imageFile);

          fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
            .then(async (res) => {
              const data = await res.json();
              if (!res.ok) {
                throw new Error(data.error || 'アップロードに失敗しました');
              }
              return data;
            })
            .then((data) => {
              if (data.url) {
                // ドロップ位置を計算
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });

                if (coordinates) {
                  // 画像を挿入
                  view.dispatch(
                    view.state.tr.insert(
                      coordinates.pos,
                      view.state.schema.nodes.image.create({ src: data.url })
                    )
                  );
                }
              } else {
                throw new Error('画像URLが取得できませんでした');
              }
            })
            .catch((error) => {
              console.error('Failed to upload image:', error);
              alert(error instanceof Error ? error.message : '画像のアップロードに失敗しました');
            });

          return true;
        }

        return false;
      },
    },
  });

  // 商品リンクボックスのダブルクリック編集イベントをリスン
  useEffect(() => {
    const handleEditProductLinkBox = (event: Event) => {
      const customEvent = event as CustomEvent<{ pos: number; attrs: Record<string, unknown> }>;
      setProductLinkBoxInitialData(customEvent.detail.attrs);
      setIsEditingProductLinkBox(true);
      setProductLinkBoxDialogOpen(true);
    };

    window.addEventListener('edit-product-link-box', handleEditProductLinkBox);

    return () => {
      window.removeEventListener('edit-product-link-box', handleEditProductLinkBox);
    };
  }, []);



  // 画像ギャラリーのダブルクリック編集イベントをリスン
  useEffect(() => {
    const handleEditImageGallery = (event: Event) => {
      const customEvent = event as CustomEvent<{ pos: number; attrs: { images: { src: string; alt?: string; caption?: string }[]; columns: number; gap: number } }>;
      setImageGalleryInitialData(customEvent.detail.attrs);
      setIsEditingImageGallery(true);
      setImageGalleryDialogOpen(true);
    };

    window.addEventListener('edit-image-gallery', handleEditImageGallery);

    return () => {
      window.removeEventListener('edit-image-gallery', handleEditImageGallery);
    };
  }, []);

  // カスタム画像のダブルクリック編集イベントをリスン
  useEffect(() => {
    const handleEditCustomImage = (event: Event) => {
      const customEvent = event as CustomEvent<{ pos: number; attrs: { src: string; alt?: string; caption?: string } }>;
      // 既存の画像データを初期データとして設定
      setImageInitialData({
        src: customEvent.detail.attrs.src,
        alt: customEvent.detail.attrs.alt,
        caption: customEvent.detail.attrs.caption,
      });
      setImageDialogOpen(true);
    };

    window.addEventListener('edit-custom-image', handleEditCustomImage);

    return () => {
      window.removeEventListener('edit-custom-image', handleEditCustomImage);
    };
  }, []);

  // 埋め込み広告のダブルクリック編集イベントをリスン
  useEffect(() => {
    const handleEditEmbedAdBox = (event: Event) => {
      const customEvent = event as CustomEvent<{ pos: number; attrs: { embedCode?: string; pcEmbedCode?: string; mobileEmbedCode?: string } }>;
      setEmbedAdBoxInitialData({
        embedCode: customEvent.detail.attrs.embedCode,
        pcEmbedCode: customEvent.detail.attrs.pcEmbedCode,
        mobileEmbedCode: customEvent.detail.attrs.mobileEmbedCode,
      });
      setIsEditingEmbedAdBox(true);
      setEmbedAdBoxDialogOpen(true);
    };

    window.addEventListener('edit-embed-ad-box', handleEditEmbedAdBox);

    return () => {
      window.removeEventListener('edit-embed-ad-box', handleEditEmbedAdBox);
    };
  }, []);

  // CTAボタンの編集イベントをリスン
  useEffect(() => {
    const handleEditCtaButton = (event: Event) => {
      const customEvent = event as CustomEvent<{
        pos: number;
        attrs: {
          href: string;
          text: string;
          variant: "primary" | "secondary" | "outline";
          bgColor?: string;
          textColor?: string;
          animation?: "none" | "pulse" | "bounce" | "shine" | "glow";
        };
      }>;
      setCtaButtonInitialData(customEvent.detail.attrs);
      setIsEditingCtaButton(true);
      setCtaButtonDialogOpen(true);
    };

    window.addEventListener('edit-cta-button', handleEditCtaButton);

    return () => {
      window.removeEventListener('edit-cta-button', handleEditCtaButton);
    };
  }, []);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    setLinkInitialData(undefined);
    setLinkDialogOpen(true);
  };

  const addImage = () => {
    setImageInitialData(undefined);
    setImageDialogOpen(true);
  };

  const addSpeechBubble = () => {
    setSpeechBubbleDialogOpen(true);
  };

  const addCtaButton = () => {
    setCtaButtonInitialData(undefined);
    setCtaButtonDialogOpen(true);
  };

  const addProductLinkBox = () => {
    setProductLinkBoxInitialData(undefined);
    setIsEditingProductLinkBox(false);
    setProductLinkBoxDialogOpen(true);
  };

  const addEmbedAdBox = () => {
    setEmbedAdBoxDialogOpen(true);
  };

  const handleYoutubeInsert = (url: string) => {
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const handleImageSelect = (data: { src: string; alt?: string; caption?: string }) => {
    if (imageInitialData) {
      // 編集モード: 既存の画像を更新
      editor.chain().focus().updateAttributes('image', data).run();
      setImageInitialData(undefined);
    } else {
      // 新規作成モード
      editor.chain().focus().setImage(data).run();
    }
  };

  const handleCtaButtonSelect = (options: {
    href: string;
    text: string;
    variant: 'primary' | 'secondary' | 'outline';
    bgColor?: string;
    textColor?: string;
    animation?: 'none' | 'pulse' | 'bounce' | 'shine' | 'glow';
  }) => {
    if (ctaButtonInitialData) {
      // 編集モード: 既存のCTAボタンを更新
      editor.chain().focus().updateAttributes('ctaButton', options).run();
    } else {
      // 新規作成モード
      editor.chain().focus().setCtaButton(options).run();
    }
    setCtaButtonInitialData(undefined);
  };

  const handleSpeechBubbleSelect = (position: "left" | "right") => {
    editor.chain().focus().toggleSpeechBubble(position).run();
  };

  const handlePointBoxInsert = (data: {
    type: 'point' | 'warning' | 'danger' | 'success' | 'info';
    title: string;
    content: string;
  }) => {
    editor.chain().focus().setPointBox(data).run();
  };

  const handleProductLinkBoxInsert = (data: {
    productName: string;
    productImage: string;
    amazonUrl?: string;
    amazonPrice?: string;
    rakutenUrl?: string;
    rakutenPrice?: string;
    yahooUrl?: string;
    yahooPrice?: string;
  }) => {
    if (isEditingProductLinkBox) {
      // 編集モード: 既存の商品リンクボックスを更新
      editor.chain().focus().updateProductLinkBox(data).run();
      setIsEditingProductLinkBox(false);
      setProductLinkBoxInitialData(undefined);
    } else {
      // 新規作成モード
      editor.chain().focus().setProductLinkBox(data).run();
    }
  };

  const handleEmbedAdBoxInsert = (embedCode?: string, pcEmbedCode?: string, mobileEmbedCode?: string) => {
    if (isEditingEmbedAdBox) {
      // 編集モード: 既存の埋め込み広告を更新
      editor.chain().focus().updateAttributes('embedAdBox', { embedCode, pcEmbedCode, mobileEmbedCode }).run();
      setIsEditingEmbedAdBox(false);
      setEmbedAdBoxInitialData(undefined);
    } else {
      // 新規作成モード
      editor.chain().focus().setEmbedAdBox({ embedCode, pcEmbedCode, mobileEmbedCode }).run();
    }
  };

  const handleImageGalleryInsert = (data: {
    images: { src: string; alt?: string; caption?: string }[];
    columns: number;
    gap: number;
  }) => {
    if (isEditingImageGallery) {
      // 編集モード: 既存のギャラリーを更新
      editor.chain().focus().updateImageGallery(data).run();
      setIsEditingImageGallery(false);
      setImageGalleryInitialData(undefined);
    } else {
      // 新規作成モード
      editor.chain().focus().setImageGallery(data).run();
    }
  };

  const handleLinkInsert = async (data: {
    href: string;
    text?: string;
    linkTarget: "internal" | "external";
  }) => {
    if (data.linkTarget === "external") {
      // 外部リンク（通常のリンク）
      if (linkInitialData) {
        // 編集モード: 既存のリンクを更新
        if (data.text && data.text !== linkInitialData.text) {
          // テキストも変更された場合は、リンクを削除して新しいリンクを挿入
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .unsetLink()
            .insertContent(`<a href="${data.href}">${data.text}</a>`)
            .run();
        } else {
          // URLのみ変更の場合
          editor.chain().focus().extendMarkRange('link').setLink({ href: data.href }).run();
        }
        setLinkInitialData(undefined);
      } else {
        // 新規作成モード
        if (data.text) {
          editor
            .chain()
            .focus()
            .insertContent(`<a href="${data.href}">${data.text}</a>`)
            .run();
        } else {
          editor.chain().focus().setLink({ href: data.href }).run();
        }
      }
    } else {
      // 内部リンク（自動的にリンクカード形式）
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
                thumbnail: postData.og_image_url || postData.thumbnail_url,
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
        <TooltipProvider delayDuration={300}>
          <div className="sticky top-0 z-40 flex flex-wrap gap-1 rounded-t-[calc(0.375rem-1px)] border-b bg-muted p-2 shadow-sm">
            {/* 見出しグループ */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1">
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
                    title="見出し2"
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
                    title="見出し3"
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
                    title="見出し4"
                  >
                    <Heading4 className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>見出し関連</p>
              </TooltipContent>
            </Tooltip>
            <div className="mx-1 w-px bg-border" />

            {/* 文字装飾グループ */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={
                      editor.isActive("bold") ? "bg-accent border-2 border-primary" : ""
                    }
                    disabled={disabled}
                    title="太字"
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
                    title="斜体"
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
                    title="下線"
                  >
                    <UnderlineIcon className="h-4 w-4" />
                  </Button>
                  <ColorPickerPopover
                    currentColor={editor.getAttributes("textStyle").color}
                    onColorChange={(color) => editor.chain().focus().setColor(color).run()}
                    disabled={disabled}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>文字装飾関連</p>
              </TooltipContent>
            </Tooltip>
            <div className="mx-1 w-px bg-border" />

            {/* ブロックグループ */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1">
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
                    title="箇条書きリスト"
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
                    title="番号付きリスト"
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
                    title="引用"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={
                      editor.isActive("code")
                        ? "bg-accent border-2 border-primary"
                        : ""
                    }
                    disabled={disabled}
                    title="インラインコード"
                  >
                    <Code2 className="h-4 w-4" />
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
                    title="コードブロック"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>ブロック関連</p>
              </TooltipContent>
            </Tooltip>
            <div className="mx-1 w-px bg-border" />

            {/* リンク関連グループ */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addCtaButton}
                    className={
                      editor.isActive("ctaButton")
                        ? "bg-accent border-2 border-primary"
                        : ""
                    }
                    disabled={disabled}
                    title="CTAボタン"
                  >
                    <MousePointerClick className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={
                      editor.isActive("link") ? "bg-accent border-2 border-primary" : ""
                    }
                    disabled={disabled}
                    title="リンク"
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>リンク関連</p>
              </TooltipContent>
            </Tooltip>
            <div className="mx-1 w-px bg-border" />

            {/* 画像・動画グループ */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                    disabled={disabled}
                    title="画像"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImageGalleryInitialData(undefined);
                      setIsEditingImageGallery(false);
                      setImageGalleryDialogOpen(true);
                    }}
                    className={
                      editor.isActive("imageGallery")
                        ? "bg-accent border-2 border-primary"
                        : ""
                    }
                    disabled={disabled}
                    title="画像ギャラリー"
                  >
                    <Images className="h-4 w-4" />
                  </Button>
                  <YoutubePopover
                    open={youtubePopoverOpen}
                    onOpenChange={setYoutubePopoverOpen}
                    onInsert={handleYoutubeInsert}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={
                        editor.isActive("youtube")
                          ? "bg-accent border-2 border-primary"
                          : ""
                      }
                      disabled={disabled}
                      title="YouTube動画"
                    >
                      <YoutubeIcon className="h-4 w-4" />
                    </Button>
                  </YoutubePopover>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>画像・動画関連</p>
              </TooltipContent>
            </Tooltip>
            <div className="mx-1 w-px bg-border" />

            {/* テーブルグループ */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run()
                    }
                    disabled={disabled}
                    title="テーブル挿入"
                  >
                    <TableIcon className="h-4 w-4" />
                  </Button>
                  {editor.isActive("table") && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          editor.chain().focus().addColumnBefore().run()
                        }
                        disabled={disabled}
                        title="列を前に追加"
                      >
                        <Columns className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          editor.chain().focus().addRowBefore().run()
                        }
                        disabled={disabled}
                        title="行を前に追加"
                      >
                        <Rows className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        disabled={disabled}
                        title="テーブル削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>テーブル関連</p>
              </TooltipContent>
            </Tooltip>
            <div className="mx-1 w-px bg-border" />

            {/* 吹き出しグループ */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addSpeechBubble}
                    className={
                      editor.isActive("speechBubble")
                        ? "bg-accent border-2 border-primary"
                        : ""
                    }
                    disabled={disabled}
                    title="吹き出し"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPointBoxDialogOpen(true)}
                    className={
                      editor.isActive("pointBox")
                        ? "bg-accent border-2 border-primary"
                        : ""
                    }
                    disabled={disabled}
                    title="ポイントボックス"
                  >
                    <Lightbulb className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>吹き出し・ポイントボックス</p>
              </TooltipContent>
            </Tooltip>
            <div className="mx-1 w-px bg-border" />

            {/* アフィリエイトグループ */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addProductLinkBox}
                    className={
                      editor.isActive("productLinkBox")
                        ? "bg-accent border-2 border-primary"
                        : ""
                    }
                    disabled={disabled}
                    title="商品リンクボックス"
                  >
                    <Package className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addEmbedAdBox}
                    className={
                      editor.isActive("embedAdBox")
                        ? "bg-accent border-2 border-primary"
                        : ""
                    }
                    disabled={disabled}
                    title="埋め込み広告"
                  >
                    <MonitorPlay className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>アフィリエイトリンク</p>
              </TooltipContent>
            </Tooltip>
            <div className="mx-1 w-px bg-border" />

            {/* 装飾解除グループ */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1">
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
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>装飾解除</p>
              </TooltipContent>
            </Tooltip>
            <div className="mx-1 w-px bg-border" />

            {/* 操作グループ */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo() || disabled}
                    title="元に戻す"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo() || disabled}
                    title="やり直す"
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>操作</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {/* エディタエリア */}
        <EditorContent editor={editor} />
      </div>

      <ImagePickerDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onSelect={handleImageSelect}
        initialData={imageInitialData}
      />
      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onInsert={handleLinkInsert}
        initialData={linkInitialData}
      />
      <SpeechBubbleDialog
        open={speechBubbleDialogOpen}
        onOpenChange={setSpeechBubbleDialogOpen}
        onSelect={handleSpeechBubbleSelect}
      />
      <CtaButtonDialog
        open={ctaButtonDialogOpen}
        onOpenChange={(open) => {
          setCtaButtonDialogOpen(open);
          if (!open) {
            setIsEditingCtaButton(false);
            setCtaButtonInitialData(undefined);
          }
        }}
        onSelect={handleCtaButtonSelect}
        initialData={ctaButtonInitialData}
        isEditMode={isEditingCtaButton}
      />
      <PointBoxDialog
        open={pointBoxDialogOpen}
        onOpenChange={setPointBoxDialogOpen}
        onInsert={handlePointBoxInsert}
      />
      <ProductLinkBoxDialog
        open={productLinkBoxDialogOpen}
        onOpenChange={setProductLinkBoxDialogOpen}
        onInsert={handleProductLinkBoxInsert}
        initialData={productLinkBoxInitialData}
        isEditMode={isEditingProductLinkBox}
      />
      <EmbedAdBoxDialog
        open={embedAdBoxDialogOpen}
        onOpenChange={(open) => {
          setEmbedAdBoxDialogOpen(open);
          if (!open) {
            setIsEditingEmbedAdBox(false);
            setEmbedAdBoxInitialData(undefined);
          }
        }}
        onInsert={handleEmbedAdBoxInsert}
        initialData={embedAdBoxInitialData}
        isEditMode={isEditingEmbedAdBox}
      />
      <ImageGalleryDialog
        open={imageGalleryDialogOpen}
        onOpenChange={(open) => {
          setImageGalleryDialogOpen(open);
          if (!open) {
            setIsEditingImageGallery(false);
            setImageGalleryInitialData(undefined);
          }
        }}
        onSubmit={handleImageGalleryInsert}
        initialData={imageGalleryInitialData}
        isEditMode={isEditingImageGallery}
      />
    </>
  );
}
