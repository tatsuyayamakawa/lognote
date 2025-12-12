import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ProductLinkBoxView } from '../node-views/product-link-box-view'

export interface ProductLinkBoxOptions {
  HTMLAttributes: Record<string, unknown>
  enableNodeView?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    productLinkBox: {
      setProductLinkBox: (options: {
        productName: string
        productImage: string
        amazonUrl?: string
        amazonPrice?: string
        rakutenUrl?: string
        rakutenPrice?: string
        yahooUrl?: string
        yahooPrice?: string
      }) => ReturnType
      updateProductLinkBox: (options: {
        productName?: string
        productImage?: string
        amazonUrl?: string
        amazonPrice?: string
        rakutenUrl?: string
        rakutenPrice?: string
        yahooUrl?: string
        yahooPrice?: string
      }) => ReturnType
    }
  }
}

export const ProductLinkBox = Node.create<ProductLinkBoxOptions>({
  name: 'productLinkBox',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      productName: {
        default: '',
      },
      productImage: {
        default: '',
      },
      amazonUrl: {
        default: null,
      },
      amazonPrice: {
        default: null,
      },
      rakutenUrl: {
        default: null,
      },
      rakutenPrice: {
        default: null,
      },
      yahooUrl: {
        default: null,
      },
      yahooPrice: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-product-link-box]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const {
      productName,
      productImage,
      amazonUrl,
      amazonPrice,
      rakutenUrl,
      rakutenPrice,
      yahooUrl,
      yahooPrice
    } = node.attrs

    // 常に3つのボタンを表示（URLがない場合はopacity-50で無効化）
    const buttons = [
      [
        'a',
        {
          href: amazonUrl || '#',
          class: `product-link-button amazon-button${!amazonUrl ? ' opacity-50 pointer-events-none' : ''}`,
          target: amazonUrl ? '_blank' : undefined,
          rel: amazonUrl ? 'noopener noreferrer nofollow' : undefined,
        },
        `Amazon${amazonPrice ? ` ¥${amazonPrice}` : ''}`
      ],
      [
        'a',
        {
          href: rakutenUrl || '#',
          class: `product-link-button rakuten-button${!rakutenUrl ? ' opacity-50 pointer-events-none' : ''}`,
          target: rakutenUrl ? '_blank' : undefined,
          rel: rakutenUrl ? 'noopener noreferrer nofollow' : undefined,
        },
        `楽天${rakutenPrice ? ` ¥${rakutenPrice}` : ''}`
      ],
      [
        'a',
        {
          href: yahooUrl || '#',
          class: `product-link-button yahoo-button${!yahooUrl ? ' opacity-50 pointer-events-none' : ''}`,
          target: yahooUrl ? '_blank' : undefined,
          rel: yahooUrl ? 'noopener noreferrer' : undefined,
        },
        `Yahoo!${yahooPrice ? ` ¥${yahooPrice}` : ''}`
      ]
    ]

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-product-link-box': '',
        'class': 'product-link-box',
      }),
      [
        'div',
        { class: 'product-link-box-content' },
        productImage ? [
          'div',
          { class: 'product-link-box-image' },
          ['img', { src: productImage, alt: productName }]
        ] : null,
        [
          'div',
          { class: 'product-link-box-info' },
          [
            'div',
            { class: 'product-link-box-name' },
            productName || '商品名'
          ],
          [
            'div',
            { class: 'product-link-box-buttons' },
            ...buttons
          ]
        ]
      ].filter(Boolean)
    ]
  },

  addCommands() {
    return {
      setProductLinkBox:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
      updateProductLinkBox:
        (options) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const node = state.doc.nodeAt(selection.from)

          if (node && node.type.name === this.name) {
            if (dispatch) {
              tr.setNodeMarkup(selection.from, undefined, {
                ...node.attrs,
                ...options,
              })
            }
            return true
          }

          return false
        },
    }
  },

  addNodeView() {
    if (this.options.enableNodeView) {
      return ReactNodeViewRenderer(ProductLinkBoxView)
    }
    return null
  },
})
