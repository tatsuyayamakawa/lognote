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

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-link-card': '',
      }),
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
