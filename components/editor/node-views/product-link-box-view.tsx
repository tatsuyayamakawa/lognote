"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import Image from "next/image";
import { createProductLinkBoxEditHandler } from "../utils/node-edit-helper";
import { Button } from "@/components/ui/button";

export function ProductLinkBoxView(props: NodeViewProps) {
  const { node, deleteNode, editor } = props;
  const {
    productName,
    productImage,
    amazonUrl,
    amazonPrice,
    rakutenUrl,
    rakutenPrice,
    yahooUrl,
    yahooPrice,
  } = node.attrs;

  const isEditorMode = editor.isEditable;
  const handleDoubleClick = createProductLinkBoxEditHandler(props);

  return (
    <NodeViewWrapper
      className="product-link-box relative group"
      data-product-link-box=""
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
      <div className="product-link-box-content">
        {productImage && (
          <div className="product-link-box-image">
            <Image
              src={productImage}
              alt={productName || "商品画像"}
              fill
              className="object-cover my-0!"
              loading="lazy"
            />
          </div>
        )}
        <div className="product-link-box-info">
          <div className="product-link-box-name">{productName || "商品名"}</div>
          {(amazonPrice || rakutenPrice || yahooPrice) && (
            <div className="product-link-box-prices">
              {amazonPrice && (
                <div className="product-link-box-price-item">
                  <span className="product-link-box-price-label">Amazon:</span>
                  <span className="product-link-box-price-value">¥{Number(amazonPrice).toLocaleString()}</span>
                </div>
              )}
              {rakutenPrice && (
                <div className="product-link-box-price-item">
                  <span className="product-link-box-price-label">楽天:</span>
                  <span className="product-link-box-price-value">¥{Number(rakutenPrice).toLocaleString()}</span>
                </div>
              )}
              {yahooPrice && (
                <div className="product-link-box-price-item">
                  <span className="product-link-box-price-label">Yahoo!:</span>
                  <span className="product-link-box-price-value">¥{Number(yahooPrice).toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
          <div className="product-link-box-buttons">
            <a
              href={amazonUrl || "#"}
              className={`product-link-button amazon-button ${!amazonUrl ? "opacity-50 pointer-events-none" : ""}`}
              target={amazonUrl ? "_blank" : undefined}
              rel={amazonUrl ? "noopener noreferrer nofollow" : undefined}
              onClick={(e) => !amazonUrl && e.preventDefault()}
            >
              Amazon
            </a>
            <a
              href={rakutenUrl || "#"}
              className={`product-link-button rakuten-button ${!rakutenUrl ? "opacity-50 pointer-events-none" : ""}`}
              target={rakutenUrl ? "_blank" : undefined}
              rel={rakutenUrl ? "noopener noreferrer nofollow" : undefined}
              onClick={(e) => !rakutenUrl && e.preventDefault()}
            >
              楽天
            </a>
            <a
              href={yahooUrl || "#"}
              className={`product-link-button yahoo-button ${!yahooUrl ? "opacity-50 pointer-events-none" : ""}`}
              target={yahooUrl ? "_blank" : undefined}
              rel={yahooUrl ? "noopener noreferrer" : undefined}
              onClick={(e) => !yahooUrl && e.preventDefault()}
            >
              Yahoo!
            </a>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
