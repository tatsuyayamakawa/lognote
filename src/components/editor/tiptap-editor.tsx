"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Code } from "@tiptap/extension-code";
import { CustomYoutube } from "./extensions/custom-youtube";
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
import { LeftHeaderTable } from "./extensions/left-header-table";
import { Instagram } from "./extensions/instagram";
import { CustomCodeBlockWithNodeView } from "./extensions/custom-code-block";
import { cn } from "@/lib/utils";
import { ImagePickerDialog } from "./dialogs/image-picker-dialog";
import { LinkDialog } from "./dialogs/link-dialog";
import { SpeechBubbleDialog } from "./dialogs/speech-bubble-dialog";
import { CtaButtonDialog } from "./dialogs/cta-button-dialog";
import { PointBoxDialog } from "./dialogs/point-box-dialog";
import { ProductLinkBoxDialog } from "./dialogs/product-link-box-dialog";
import { EmbedAdBoxDialog } from "./dialogs/embed-ad-box-dialog";
import { ImageGalleryDialog } from "./dialogs/image-gallery-dialog";
import { LeftHeaderTableDialog } from "./dialogs/left-header-table-dialog";
import { CodeBlockDialog } from "./dialogs/code-block-dialog";
import { EditorToolbar } from "./editor-toolbar";
import { useEditorDialogs } from "./hooks/use-editor-dialogs";
import { useEditorEvents } from "./hooks/use-editor-events";

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
  const [, forceUpdate] = useState({});
  const dialogs = useEditorDialogs();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
        link: false, // Link拡張を無効化して、後で個別に設定
        codeBlock: false, // CodeBlock拡張を無効化して、CustomCodeBlockを使用
        code: false, // Code拡張を無効化して、カスタム設定を使用
      }),
      Code.configure({
        HTMLAttributes: {
          class: 'inline-code',
        },
      }),
      CustomCodeBlockWithNodeView,
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
      CustomYoutube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: "rounded-lg my-4",
        },
      }),
      Instagram.configure({
        enableNodeView: true,
        HTMLAttributes: {
          class: "my-4",
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
      LeftHeaderTable.configure({
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
      const editorElement = editor.view.dom;
      editorElement.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const linkElement = target.closest('a');

        if (linkElement && !disabled) {
          const embedAdBox = linkElement.closest('[data-embed-ad-box]');
          if (embedAdBox) return;

          event.preventDefault();
          const href = linkElement.getAttribute('href') || '';
          const text = linkElement.textContent || '';
          dialogs.setLinkDialog({ open: true, initialData: { href, text } });
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
          "prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-4 prose-h4:mb-2",
          "prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
          "prose-pre:bg-muted prose-pre:border prose-pre:text-foreground dark:prose-pre:text-white"
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

  useEditorEvents({
    onProductLinkBoxEdit: (attrs) => {
      dialogs.setProductLinkBoxDialog({ open: true, initialData: attrs, isEditing: true });
    },
    onImageGalleryEdit: (attrs) => {
      // 存在するフィールドのみを保持
      const cleanedAttrs = {
        ...attrs,
        images: attrs.images?.map((img: any) => {
          const result: any = { src: img.src };
          if (img.alt && img.alt.trim()) result.alt = img.alt;
          if (img.caption && img.caption.trim()) result.caption = img.caption;
          return result;
        }) || [],
      };
      dialogs.setImageGalleryDialog({ open: true, initialData: cleanedAttrs, isEditing: true });
    },
    onCustomImageEdit: (attrs) => {
      dialogs.setImageDialog({ open: true, initialData: attrs });
    },
    onEmbedAdBoxEdit: (attrs) => {
      dialogs.setEmbedAdBoxDialog({ open: true, initialData: attrs, isEditing: true });
    },
    onPointBoxEdit: (attrs) => {
      dialogs.setPointBoxDialog({ open: true, initialData: attrs, isEditing: true });
    },
    onCtaButtonEdit: (attrs) => {
      dialogs.setCtaButtonDialog({ open: true, initialData: attrs, isEditing: true });
    },
  });


  useEffect(() => {
    if (!editor) return;

    interface HTMLElementWithTimeout extends HTMLElement {
      _scrollTimeout?: ReturnType<typeof setTimeout>;
    }

    const checkScrollable = (wrapper: HTMLElementWithTimeout) => {
      const isScrollable = wrapper.scrollWidth > wrapper.clientWidth;
      wrapper.classList.toggle('has-scroll', isScrollable);

      const handleScroll = () => {
        wrapper.classList.add('is-scrolling');
        if (wrapper._scrollTimeout) clearTimeout(wrapper._scrollTimeout);
        wrapper._scrollTimeout = setTimeout(() => wrapper.classList.remove('is-scrolling'), 1000);
      };

      wrapper.removeEventListener('scroll', handleScroll);
      wrapper.addEventListener('scroll', handleScroll);
    };

    const wrapTables = () => {
      const tables = editor.view.dom.querySelectorAll('table');
      tables.forEach((table) => {
        const parent = table.parentElement;
        if (parent?.classList.contains('table-scroll-wrapper') || parent?.classList.contains('tableWrapper')) {
          checkScrollable(parent);
          return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'table-scroll-wrapper';
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        setTimeout(() => checkScrollable(wrapper), 0);
      });
    };

    wrapTables();
    const handleUpdate = () => setTimeout(wrapTables, 0);
    editor.on('update', handleUpdate);

    const resizeObserver = new ResizeObserver(() => {
      const wrappers = editor.view.dom.querySelectorAll('.table-scroll-wrapper, .tableWrapper');
      wrappers.forEach((wrapper) => checkScrollable(wrapper as HTMLElement));
    });
    resizeObserver.observe(editor.view.dom);

    return () => {
      editor.off('update', handleUpdate);
      resizeObserver.disconnect();
    };
  }, [editor]);

  if (!editor) {
    return null;
  }



  const handleImageSelect = (data: { src: string; alt?: string; caption?: string }) => {
    if (dialogs.imageDialog.initialData) {
      editor?.chain().focus().updateAttributes('image', data).run();
    } else {
      editor?.chain().focus().setImage(data).run();
    }
  };

  const handleCtaButtonSelect = (data: {
    href: string;
    text: string;
    variant: 'primary' | 'secondary' | 'outline';
    bgColor?: string;
    textColor?: string;
    animation?: 'none' | 'pulse' | 'bounce' | 'shine' | 'glow';
  }) => {
    if (dialogs.ctaButtonDialog.isEditing) {
      editor?.chain().focus().updateAttributes('ctaButton', data).run();
    } else {
      editor?.chain().focus().setCtaButton(data).run();
    }
  };

  const handlePointBoxInsert = (data: { type: 'point' | 'warning' | 'danger' | 'success' | 'info'; title: string; content: string }) => {
    if (dialogs.pointBoxDialog.isEditing) {
      editor?.chain().focus().updateAttributes('pointBox', data).run();
    } else {
      editor?.chain().focus().setPointBox(data).run();
    }
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
    if (dialogs.productLinkBoxDialog.isEditing) {
      editor?.chain().focus().updateProductLinkBox(data).run();
    } else {
      editor?.chain().focus().setProductLinkBox(data).run();
    }
  };

  const handleEmbedAdBoxInsert = (embedCode?: string, pcEmbedCode?: string, mobileEmbedCode?: string) => {
    const data = { embedCode, pcEmbedCode, mobileEmbedCode };
    if (dialogs.embedAdBoxDialog.isEditing) {
      editor?.chain().focus().updateAttributes('embedAdBox', data).run();
    } else {
      editor?.chain().focus().setEmbedAdBox(data).run();
    }
  };

  const handleImageGalleryInsert = (data: { images: { src: string; alt?: string; caption?: string }[]; columns: number; gap: number }) => {
    if (dialogs.imageGalleryDialog.isEditing) {
      editor?.chain().focus().updateImageGallery(data).run();
    } else {
      editor?.chain().focus().setImageGallery(data).run();
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <EditorToolbar
          editor={editor}
          disabled={disabled}
          onAddLink={() => dialogs.setLinkDialog({ open: true })}
          onAddImage={() => dialogs.setImageDialog({ open: true })}
          onAddSpeechBubble={() => dialogs.setSpeechBubbleDialogOpen(true)}
          onAddCtaButton={() => dialogs.setCtaButtonDialog({ open: true, isEditing: false })}
          onAddProductLinkBox={() => dialogs.setProductLinkBoxDialog({ open: true, isEditing: false })}
          onAddEmbedAdBox={() => dialogs.setEmbedAdBoxDialog({ open: true, isEditing: false })}
          onAddImageGallery={() => dialogs.setImageGalleryDialog({ open: true, isEditing: false })}
          onAddLeftHeaderTable={() => dialogs.setLeftHeaderTableDialogOpen(true)}
          onAddPointBox={() => dialogs.setPointBoxDialog({ open: true, isEditing: false })}
          onAddCodeBlock={() => dialogs.setCodeBlockDialog({ open: true })}
          youtubePopoverOpen={dialogs.youtubePopoverOpen}
          onYoutubePopoverChange={dialogs.setYoutubePopoverOpen}
          onYoutubeInsert={(url) => editor?.chain().focus().setYoutubeVideo({ src: url }).run()}
          instagramPopoverOpen={dialogs.instagramPopoverOpen}
          onInstagramPopoverChange={dialogs.setInstagramPopoverOpen}
          onInstagramInsert={(url) => editor?.chain().focus().setInstagram({ url }).run()}
        />
        <EditorContent editor={editor} />
      </div>

      <ImagePickerDialog
        open={dialogs.imageDialog.open}
        onOpenChange={(open) => dialogs.setImageDialog({ ...dialogs.imageDialog, open })}
        onSelect={handleImageSelect}
        initialData={dialogs.imageDialog.initialData}
      />
      <LinkDialog
        open={dialogs.linkDialog.open}
        onOpenChange={(open) => dialogs.setLinkDialog({ ...dialogs.linkDialog, open })}
        onInsert={async (data) => {
          if (!editor) return;
          if (data.linkTarget === "external") {
            const isEditing = dialogs.linkDialog.initialData;
            if (isEditing && data.text && data.text !== dialogs.linkDialog.initialData?.text) {
              editor.chain().focus().extendMarkRange('link').unsetLink().insertContent(`<a href="${data.href}">${data.text}</a>`).run();
            } else if (isEditing) {
              editor.chain().focus().extendMarkRange('link').setLink({ href: data.href }).run();
            } else if (data.text) {
              editor.chain().focus().insertContent(`<a href="${data.href}">${data.text}</a>`).run();
            } else {
              editor.chain().focus().setLink({ href: data.href }).run();
            }
          } else {
            try {
              const slug = data.href.startsWith("/") ? data.href.slice(1) : data.href;
              const response = await fetch(`/api/posts/by-slug?slug=${slug}`);
              const cardData = response.ok ? await response.json() : null;
              editor.chain().focus().setLinkCard({
                href: data.href,
                ...(cardData && { title: cardData.title, description: cardData.description, thumbnail: cardData.og_image_url || cardData.thumbnail_url }),
              }).run();
            } catch (error) {
              console.error("Failed to fetch link card data:", error);
              editor.chain().focus().setLinkCard({ href: data.href }).run();
            }
          }
        }}
        initialData={dialogs.linkDialog.initialData}
      />
      <SpeechBubbleDialog
        open={dialogs.speechBubbleDialogOpen}
        onOpenChange={dialogs.setSpeechBubbleDialogOpen}
        onSelect={(position) => editor?.chain().focus().toggleSpeechBubble(position).run()}
      />
      <CtaButtonDialog
        open={dialogs.ctaButtonDialog.open}
        onOpenChange={(open) => dialogs.setCtaButtonDialog({ ...dialogs.ctaButtonDialog, open, ...(!open && { isEditing: false, initialData: undefined }) })}
        onSelect={handleCtaButtonSelect}
        initialData={dialogs.ctaButtonDialog.initialData}
        isEditMode={dialogs.ctaButtonDialog.isEditing}
      />
      <PointBoxDialog
        key={dialogs.pointBoxDialog.initialData ? JSON.stringify(dialogs.pointBoxDialog.initialData) : 'new'}
        open={dialogs.pointBoxDialog.open}
        onOpenChange={(open) => dialogs.setPointBoxDialog({ ...dialogs.pointBoxDialog, open, ...(!open && { isEditing: false, initialData: undefined }) })}
        onInsert={handlePointBoxInsert}
        initialData={dialogs.pointBoxDialog.initialData}
        isEditMode={dialogs.pointBoxDialog.isEditing}
      />
      <ProductLinkBoxDialog
        open={dialogs.productLinkBoxDialog.open}
        onOpenChange={(open) => dialogs.setProductLinkBoxDialog({ ...dialogs.productLinkBoxDialog, open, ...(!open && { isEditing: false, initialData: undefined }) })}
        onInsert={handleProductLinkBoxInsert}
        initialData={dialogs.productLinkBoxDialog.initialData}
        isEditMode={dialogs.productLinkBoxDialog.isEditing}
      />
      <EmbedAdBoxDialog
        open={dialogs.embedAdBoxDialog.open}
        onOpenChange={(open) => dialogs.setEmbedAdBoxDialog({ ...dialogs.embedAdBoxDialog, open, ...(!open && { isEditing: false, initialData: undefined }) })}
        onInsert={handleEmbedAdBoxInsert}
        initialData={dialogs.embedAdBoxDialog.initialData}
        isEditMode={dialogs.embedAdBoxDialog.isEditing}
      />
      <ImageGalleryDialog
        open={dialogs.imageGalleryDialog.open}
        onOpenChange={(open) => dialogs.setImageGalleryDialog({ ...dialogs.imageGalleryDialog, open, ...(!open && { isEditing: false, initialData: undefined }) })}
        onSubmit={handleImageGalleryInsert}
        initialData={dialogs.imageGalleryDialog.initialData}
        isEditMode={dialogs.imageGalleryDialog.isEditing}
      />
      <LeftHeaderTableDialog
        open={dialogs.leftHeaderTableDialogOpen}
        onOpenChange={dialogs.setLeftHeaderTableDialogOpen}
        onInsert={(data) => editor?.chain().focus().setLeftHeaderTable(data).run()}
      />
      <CodeBlockDialog
        open={dialogs.codeBlockDialog.open}
        onOpenChange={(open) => dialogs.setCodeBlockDialog({ ...dialogs.codeBlockDialog, open })}
        onInsert={(filename, language) => {
          editor?.chain().focus().toggleCodeBlock().run();
          if (filename || language) {
            editor?.chain().focus().updateAttributes('codeBlock', { filename, language }).run();
          }
        }}
        initialData={dialogs.codeBlockDialog.initialData}
      />
    </>
  );
}
