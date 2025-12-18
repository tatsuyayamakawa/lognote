"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { ExternalLink, Code2 } from "lucide-react";
import { detectProvider } from "@/lib/detect-provider";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function AffiliateBoxView({ node, editor }: NodeViewProps) {
  const { code, productName, productImage, productPrice, productUrl } = node.attrs;
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // コードからプロバイダー情報を自動判定
  const providerInfo = detectProvider(code);

  // エディタモードかビューアモードかを判定
  const isEditorMode = editor.isEditable;

  // ビューアモード時のみscriptタグを実行
  useEffect(() => {
    if (!isEditorMode && codeContainerRef.current && code) {
      const container = codeContainerRef.current;

      // scriptタグを検出して実行
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = code;

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
  }, [code, isEditorMode]);

  return (
    <NodeViewWrapper className="affiliate-box-node-view my-6">
      <div className="rounded-lg border-2 border-border bg-card shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* プロバイダーバッジ */}
        <div className={`${providerInfo.color} ${providerInfo.textColor} px-3 py-1 text-xs font-semibold flex items-center gap-1`}>
          <Code2 className="w-3 h-3" />
          {providerInfo.name}
        </div>

        <div className="p-4">
          {/* 商品情報がある場合 */}
          {(productName || productImage || productPrice) && (
            <div className="flex gap-4 mb-4">
              {productImage && (
                <div className="shrink-0">
                  <Image
                    src={productImage}
                    alt={productName || "商品画像"}
                    className="w-24 h-24 object-cover rounded"
                    width={96}
                    height={96}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {productName && (
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {productName}
                  </h3>
                )}
                {productPrice && (
                  <p className="text-lg font-bold text-primary mb-2">
                    {productPrice}
                  </p>
                )}
              </div>
            </div>
          )}

          {isEditorMode ? (
            // エディタモード: コードプレビューとリンクボタン
            <>
              {/* 埋め込みコードプレビュー */}
              <div className="bg-muted/50 rounded p-3 mb-3">
                <div className="text-xs text-muted-foreground mb-1">
                  埋め込みコード:
                </div>
                <div className="text-xs font-mono bg-background p-2 rounded border overflow-x-auto">
                  {code.substring(0, 100)}...
                </div>
              </div>

              {/* リンクボタン */}
              {productUrl && (
                <a
                  href={productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  リンクを開く
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </>
          ) : (
            // ビューアモード: 実際の埋め込みコードを実行
            <div ref={codeContainerRef} className="affiliate-code-wrapper" />
          )}
        </div>
      </div>

      {/* 編集者へのメモ（エディタモードのみ） */}
      {isEditorMode && (
        <div className="text-xs text-muted-foreground mt-2 text-center">
          💡 公開ページでは実際の埋め込みコードが表示されます
        </div>
      )}
    </NodeViewWrapper>
  );
}
