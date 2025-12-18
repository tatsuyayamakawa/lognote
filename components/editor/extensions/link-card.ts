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
        default: '',
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
    const { href, title, description, thumbnail } = node.attrs

    const contentChildren = []

    // サムネイル画像（左側）
    if (thumbnail) {
      contentChildren.push([
        'div',
        { class: 'link-card-thumbnail' },
        ['img', { src: thumbnail, alt: title || 'Thumbnail', loading: 'lazy' }]
      ])
    }

    // テキストコンテンツ（右側）
    const textChildren = []
    const displayTitle = title || href || 'Untitled'
    textChildren.push(['div', { class: 'link-card-title' }, displayTitle])

    if (description) {
      textChildren.push(['p', { class: 'link-card-description' }, description])
    }

    contentChildren.push(['div', { class: 'link-card-content' }, ...textChildren])

    return [
      'a',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-link-card': '',
        'data-type': 'internal',
        'href': href,
      }),
      ...contentChildren
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
