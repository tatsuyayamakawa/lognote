import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { LinkCardView } from '../node-views/link-card-view'

export interface LinkCardOptions {
  HTMLAttributes: Record<string, unknown>
  enableNodeView?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkCard: {
      setLinkCard: (options: {
        href: string
        title?: string
        description?: string
        thumbnail?: string
      }) => ReturnType
    }
  }
}

export const LinkCard = Node.create<LinkCardOptions>({
  name: 'linkCard',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      href: {
        default: null,
      },
      title: {
        default: null,
      },
      description: {
        default: null,
      },
      thumbnail: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-link-card]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { href, title, description } = node.attrs

    const contentChildren = []

    // タイトルを表示（ない場合はhrefをフォールバック）
    // h3ではなくdivを使用して目次から除外
    const displayTitle = title || href || 'Untitled'
    contentChildren.push(['div', { class: 'text-lg font-semibold line-clamp-2' }, displayTitle])

    // 説明文（記事抜粋）を表示
    if (description) {
      contentChildren.push(['p', { class: 'text-sm text-muted-foreground line-clamp-2' }, description])
    }

    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-link-card': '',
        'data-type': 'internal',
        'href': href || '#',
      }),
      ['div', { class: 'space-y-1' }, ...contentChildren]
    ]
  },

  addCommands() {
    return {
      setLinkCard:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },

  addNodeView() {
    if (this.options.enableNodeView) {
      return ReactNodeViewRenderer(LinkCardView)
    }
    return null
  },
})
