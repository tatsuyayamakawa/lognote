"use client";

import { useEffect, useRef } from "react";
import { detectProvider } from "@/lib/detect-provider";

interface AffiliateBoxRendererProps {
  code: string;
  productName?: string;
  productImage?: string;
  productPrice?: string;
  productUrl?: string;
}

export function AffiliateBoxRenderer({
  code,
  productName,
  productImage,
  productPrice,
  productUrl,
}: AffiliateBoxRendererProps) {
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // コードからプロバイダー情報を自動判定
  const providerInfo = detectProvider(code);

  // アフィリエイトコードに含まれるscriptタグを実行
  useEffect(() => {
    if (codeContainerRef.current && code) {
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
  }, [code]);

  // 商品情報がある場合は装飾付きで表示
  const hasProductInfo = productName || productImage || productPrice;

  return (
    <div className="affiliate-box my-6 not-prose">
      {hasProductInfo ? (
        <div className="rounded-lg border-2 border-border bg-card shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          {/* プロバイダーバッジ */}
          <div
            className={`${providerInfo.color} ${providerInfo.textColor} px-3 py-2 text-xs font-semibold flex items-center gap-1.5`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            {providerInfo.name}
          </div>

          <div className="p-4">
            {/* 商品情報 */}
            <div className="flex gap-4 mb-4">
              {productImage && (
                <div className="shrink-0">
                  <img
                    src={productImage}
                    alt={productName || "商品画像"}
                    className="w-24 h-24 object-cover rounded"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {productName && (
                  <h3 className="font-semibold text-base mb-2 line-clamp-2">
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

            {/* 埋め込みコード */}
            <div ref={codeContainerRef} className="affiliate-code-wrapper" />
          </div>
        </div>
      ) : (
        // シンプル表示（商品情報なし）
        <div className="rounded-lg border border-border bg-card/50 p-4 shadow-sm">
          <div
            className={`inline-flex items-center gap-1.5 ${providerInfo.color} ${providerInfo.textColor} px-2 py-1 rounded text-xs font-semibold mb-3`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            {providerInfo.name}
          </div>
          <div ref={codeContainerRef} className="affiliate-code-wrapper" />
        </div>
      )}
    </div>
  );
}
