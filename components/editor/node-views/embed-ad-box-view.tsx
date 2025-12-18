"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { createEmbedAdBoxEditHandler } from "../utils/node-edit-helper";
import { Button } from "@/components/ui/button";

export function EmbedAdBoxView(props: NodeViewProps) {
  const { node, editor, deleteNode } = props;
  const { embedCode } = node.attrs;
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // エディタモードかビューアモードかを判定
  const isEditorMode = editor.isEditable;

  const handleClick = (event: React.MouseEvent) => {
    // エディタ内では広告のリンククリックを防ぐ
    if (isEditorMode) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleDoubleClick = createEmbedAdBoxEditHandler(props, isEditorMode);

  // ビューアモード時のみscriptタグを実行
  useEffect(() => {
    if (!isEditorMode && codeContainerRef.current && embedCode) {
      const container = codeContainerRef.current;

      // scriptタグを検出して実行
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = embedCode;

      const scripts = tempDiv.getElementsByTagName("script");

      // scriptタグを順番に実行
      Array.from(scripts).forEach((script) => {
        const newScript = document.createElement("script");

        if (script.src) {
          newScript.src = script.src;
          newScript.async = true;
        } else {
          newScript.textContent = script.textContent;
        }

        // 属性をコピー
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        container.appendChild(newScript);
      });

      // scriptタグ以外のコンテンツも追加
      const nonScriptContent = Array.from(tempDiv.children)
        .filter((child) => child.tagName !== "SCRIPT")
        .map((child) => child.outerHTML)
        .join("");

      if (nonScriptContent) {
        const contentDiv = document.createElement("div");
        contentDiv.innerHTML = nonScriptContent;
        container.insertBefore(contentDiv, container.firstChild);
      }
    }
  }, [embedCode, isEditorMode]);

  return (
    <NodeViewWrapper
      className="embed-ad-box relative group"
      data-embed-ad-box=""
      contentEditable={false}
      onClick={handleClick}
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
      {isEditorMode ? (
        // エディタモード: dangerouslySetInnerHTMLで表示（scriptは実行しない）
        <div
          className="embed-ad-box-content"
          dangerouslySetInnerHTML={{ __html: embedCode }}
        />
      ) : (
        // ビューアモード: scriptタグを実行
        <div ref={codeContainerRef} className="embed-ad-box-content" />
      )}
    </NodeViewWrapper>
  );
}
