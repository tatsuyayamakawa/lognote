import TiptapImage from "@tiptap/extension-image";
import { ReactNodeViewRenderer, NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createCustomImageEditHandler } from "../utils/node-edit-helper";

export interface CustomImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, string | number | boolean>;
  enableNodeView: boolean;
}

export const CustomImage = TiptapImage.extend<CustomImageOptions>({
  name: "image",

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-caption"),
        renderHTML: (attributes) => {
          if (!attributes.caption) {
            return {};
          }
          return {
            "data-caption": attributes.caption,
          };
        },
      },
    };
  },

  addNodeView() {
    if (!this.options.enableNodeView) {
      return null;
    }
    return ReactNodeViewRenderer(CustomImageComponent);
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, alt, caption } = node.attrs;

    if (caption) {
      return [
        "figure",
        { class: "my-4 max-w-md" },
        ["img", { ...HTMLAttributes, src, alt: alt || "", class: "rounded-lg w-full h-auto" }],
        ["figcaption", { class: "text-sm text-gray-600 dark:text-gray-400 mt-2 text-center" }, caption],
      ];
    }

    return ["img", { ...HTMLAttributes, src, alt: alt || "", class: "rounded-lg max-w-md w-full h-auto" }];
  },
});

function CustomImageComponent(props: NodeViewProps) {
  const { node, deleteNode, editor } = props;
  const { src, alt, caption } = node.attrs;

  const isEditorMode = editor.isEditable;
  const handleDoubleClick = createCustomImageEditHandler(props);

  return (
    <NodeViewWrapper
      className="my-4 max-w-md relative group"
      data-custom-image=""
      contentEditable={false}
      onDoubleClick={handleDoubleClick}
    >
      {isEditorMode && deleteNode && (
        <Button
          onClick={deleteNode}
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs h-6 px-2"
          contentEditable={false}
        >
          削除
        </Button>
      )}
      {isEditorMode && (
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-medium pointer-events-none">
          ダブルクリックで編集
        </div>
      )}
      <figure>
        <Image
          src={src}
          alt={alt || ""}
          width={800}
          height={600}
          className="rounded-lg w-full h-auto"
          sizes="(max-width: 768px) 100vw, 768px"
        />
        {caption && (
          <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    </NodeViewWrapper>
  );
}
