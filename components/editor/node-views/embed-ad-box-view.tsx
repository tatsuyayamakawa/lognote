"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { createEmbedAdBoxEditHandler } from "../utils/node-edit-helper";
import { Button } from "@/components/ui/button";

export function EmbedAdBoxView(props: NodeViewProps) {
  const { node, editor, deleteNode } = props;
  const { embedCode, pcEmbedCode, mobileEmbedCode } = node.attrs;
  const pcCodeContainerRef = useRef<HTMLDivElement>(null);
  const mobileCodeContainerRef = useRef<HTMLDivElement>(null);

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
    if (isEditorMode) return;

    // PC用広告の実行
    if (pcCodeContainerRef.current && pcEmbedCode) {
      const container = pcCodeContainerRef.current;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = pcEmbedCode;

      const scripts = tempDiv.getElementsByTagName("script");

      Array.from(scripts).forEach((script) => {
        const newScript = document.createElement("script");

        if (script.src) {
          newScript.src = script.src;
          newScript.async = true;
        } else {
          newScript.textContent = script.textContent;
        }

        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        container.appendChild(newScript);
      });

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

    // スマホ用広告の実行
    if (mobileCodeContainerRef.current && mobileEmbedCode) {
      const container = mobileCodeContainerRef.current;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = mobileEmbedCode;

      const scripts = tempDiv.getElementsByTagName("script");

      Array.from(scripts).forEach((script) => {
        const newScript = document.createElement("script");

        if (script.src) {
          newScript.src = script.src;
          newScript.async = true;
        } else {
          newScript.textContent = script.textContent;
        }

        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        container.appendChild(newScript);
      });

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

    // 旧形式（embedCode）の下位互換性サポート
    if (!pcEmbedCode && !mobileEmbedCode && embedCode && pcCodeContainerRef.current) {
      const container = pcCodeContainerRef.current;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = embedCode;

      const scripts = tempDiv.getElementsByTagName("script");

      Array.from(scripts).forEach((script) => {
        const newScript = document.createElement("script");

        if (script.src) {
          newScript.src = script.src;
          newScript.async = true;
        } else {
          newScript.textContent = script.textContent;
        }

        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });

        container.appendChild(newScript);
      });

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
  }, [embedCode, pcEmbedCode, mobileEmbedCode, isEditorMode]);

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
        <div className="space-y-4">
          {(pcEmbedCode || embedCode) && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">PC用広告</div>
              <div
                className="embed-ad-box-content"
                dangerouslySetInnerHTML={{ __html: pcEmbedCode || embedCode }}
              />
            </div>
          )}
          {mobileEmbedCode && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">スマホ用広告</div>
              <div
                className="embed-ad-box-content"
                dangerouslySetInnerHTML={{ __html: mobileEmbedCode }}
              />
            </div>
          )}
        </div>
      ) : (
        // ビューアモード: scriptタグを実行（メディアクエリで表示切り替え）
        <>
          {/* PC用広告（タブレット以上で表示） */}
          {(pcEmbedCode || embedCode) && (
            <div
              ref={pcCodeContainerRef}
              className="embed-ad-box-content hidden md:block"
            />
          )}
          {/* スマホ用広告（スマホサイズで表示） */}
          {mobileEmbedCode && (
            <div
              ref={mobileCodeContainerRef}
              className="embed-ad-box-content block md:hidden"
            />
          )}
        </>
      )}
    </NodeViewWrapper>
  );
}
