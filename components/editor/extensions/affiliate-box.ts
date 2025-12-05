import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { AffiliateBoxNodeView } from "./affiliate-box-node-view";
import { detectProvider } from "@/lib/detect-provider";

export interface AffiliateBoxOptions {
  enableNodeView: boolean;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    affiliateBox: {
      /**
       * アフィリエイトボックスを挿入
       */
      setAffiliateBox: (options: {
        code: string;
        productName?: string;
        productImage?: string;
        productPrice?: string;
        productUrl?: string;
      }) => ReturnType;
    };
  }
}

export const AffiliateBox = Node.create<AffiliateBoxOptions>({
  name: "affiliateBox",

  group: "block",

  atom: true,

  addOptions() {
    return {
      enableNodeView: true,
    };
  },

  addAttributes() {
    return {
      provider: {
        default: "custom",
        parseHTML: (element) => element.getAttribute("data-provider"),
        renderHTML: (attributes) => ({
          "data-provider": attributes.provider,
        }),
      },
      code: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-code"),
        renderHTML: (attributes) => ({
          "data-code": attributes.code,
        }),
      },
      productName: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-product-name"),
        renderHTML: (attributes) => ({
          "data-product-name": attributes.productName,
        }),
      },
      productImage: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-product-image"),
        renderHTML: (attributes) => ({
          "data-product-image": attributes.productImage,
        }),
      },
      productPrice: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-product-price"),
        renderHTML: (attributes) => ({
          "data-product-price": attributes.productPrice,
        }),
      },
      productUrl: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-product-url"),
        renderHTML: (attributes) => ({
          "data-product-url": attributes.productUrl,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-affiliate-box]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    // エディタビューではNode Viewを使用
    // 公開ページではシンプルなHTMLレンダリング
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-affiliate-box": "",
        "data-provider": node.attrs.provider,
        "data-code": node.attrs.code,
        "data-product-name": node.attrs.productName || "",
        "data-product-image": node.attrs.productImage || "",
        "data-product-price": node.attrs.productPrice || "",
        "data-product-url": node.attrs.productUrl || "",
        class: "affiliate-box-wrapper my-6",
      }),
    ];
  },

  addNodeView() {
    if (!this.options.enableNodeView) {
      return null;
    }
    return ReactNodeViewRenderer(AffiliateBoxNodeView);
  },

  addCommands() {
    return {
      setAffiliateBox:
        (options) =>
        ({ commands }) => {
          // コードからプロバイダーを自動判定
          const providerInfo = detectProvider(options.code);

          return commands.insertContent({
            type: this.name,
            attrs: {
              ...options,
              provider: providerInfo.provider,
            },
          });
        },
    };
  },
});
