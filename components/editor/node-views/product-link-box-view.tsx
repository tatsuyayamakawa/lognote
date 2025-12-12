"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import Image from "next/image";

export function ProductLinkBoxView({ node, getPos, editor }: NodeViewProps) {
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

  const handleDoubleClick = () => {
    if (typeof getPos === 'function') {
      const pos = getPos();
      if (pos !== undefined) {
        editor.chain().focus().setTextSelection(pos).run();

        // Dispatch custom event to open edit dialog
        window.dispatchEvent(new CustomEvent('edit-product-link-box', {
          detail: { pos, attrs: node.attrs }
        }));
      }
    }
  };

  return (
    <NodeViewWrapper
      className="product-link-box"
      data-product-link-box=""
      contentEditable={false}
      onDoubleClick={handleDoubleClick}
    >
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
          <div className="product-link-box-buttons">
            <a
              href={amazonUrl || "#"}
              className={`product-link-button amazon-button ${!amazonUrl ? "opacity-50 pointer-events-none" : ""}`}
              target={amazonUrl ? "_blank" : undefined}
              rel={amazonUrl ? "noopener noreferrer nofollow" : undefined}
              onClick={(e) => !amazonUrl && e.preventDefault()}
            >
              Amazon{amazonPrice && ` ¥${amazonPrice}`}
            </a>
            <a
              href={rakutenUrl || "#"}
              className={`product-link-button rakuten-button ${!rakutenUrl ? "opacity-50 pointer-events-none" : ""}`}
              target={rakutenUrl ? "_blank" : undefined}
              rel={rakutenUrl ? "noopener noreferrer nofollow" : undefined}
              onClick={(e) => !rakutenUrl && e.preventDefault()}
            >
              楽天{rakutenPrice && ` ¥${rakutenPrice}`}
            </a>
            <a
              href={yahooUrl || "#"}
              className={`product-link-button yahoo-button ${!yahooUrl ? "opacity-50 pointer-events-none" : ""}`}
              target={yahooUrl ? "_blank" : undefined}
              rel={yahooUrl ? "noopener noreferrer" : undefined}
              onClick={(e) => !yahooUrl && e.preventDefault()}
            >
              Yahoo!{yahooPrice && ` ¥${yahooPrice}`}
            </a>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
}
