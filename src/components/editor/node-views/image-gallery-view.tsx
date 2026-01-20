"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import Image from "next/image";
import { createImageGalleryEditHandler } from "../utils/node-edit-helper";
import { Button } from "@/components/ui/button";

export interface ImageGalleryImage {
  src: string;
  alt?: string;
  caption?: string;
}

export interface ImageGalleryAttrs {
  images: ImageGalleryImage[];
  columns: number;
  gap: number;
}

export function ImageGalleryView(props: NodeViewProps) {
  const { node, deleteNode, editor } = props;
  const { images, columns, gap } = node.attrs as ImageGalleryAttrs;

  const isEditorMode = editor.isEditable;
  const handleDoubleClick = createImageGalleryEditHandler(props, isEditorMode);

  return (
    <NodeViewWrapper
      className="image-gallery-wrapper my-6 relative group"
      data-image-gallery=""
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
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        style={{
          gridTemplateColumns: `repeat(1, 1fr)`,
          gap: `${gap}px`,
        }}
        data-columns={columns}
      >
          <style>{`
            [data-columns="1"] { grid-template-columns: repeat(1, 1fr) !important; }
            [data-columns="2"] { grid-template-columns: repeat(1, 1fr); }
            @media (min-width: 768px) {
              [data-columns="2"] { grid-template-columns: repeat(2, 1fr) !important; }
              [data-columns="3"] { grid-template-columns: repeat(2, 1fr) !important; }
              [data-columns="4"] { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (min-width: 1024px) {
              [data-columns="3"] { grid-template-columns: repeat(3, 1fr) !important; }
              [data-columns="4"] { grid-template-columns: repeat(3, 1fr) !important; }
            }
            @media (min-width: 1280px) {
              [data-columns="4"] { grid-template-columns: repeat(4, 1fr) !important; }
            }
          `}</style>
          {images.map((image: ImageGalleryImage, index: number) => (
            <div
              key={index}
              className="image-gallery-item"
            >
              <div className="relative overflow-hidden rounded image-gallery-image-wrapper">
                <Image
                  src={image.src}
                  alt={image.alt || ""}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
              {image.caption && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center mb-0">
                  {image.caption}
                </p>
              )}
            </div>
          ))}
      </div>
    </NodeViewWrapper>
  );
}
