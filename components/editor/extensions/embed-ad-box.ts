import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { EmbedAdBoxView } from '../node-views/embed-ad-box-view'

export interface EmbedAdBoxOptions {
  HTMLAttributes: Record<string, unknown>
  enableNodeView?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embedAdBox: {
      setEmbedAdBox: (options: {
        embedCode: string
      }) => ReturnType
    }
  }
}

export const EmbedAdBox = Node.create<EmbedAdBoxOptions>({
  name: 'embedAdBox',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      embedCode: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-embed-ad-box]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { embedCode } = node.attrs

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-embed-ad-box': '',
        'class': 'embed-ad-box',
      }),
      [
        'div',
        {
          class: 'embed-ad-box-content',
          innerHTML: embedCode
        },
      ],
    ]
  },

  addCommands() {
    return {
      setEmbedAdBox:
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
      return ReactNodeViewRenderer(EmbedAdBoxView)
    }
    return null
  },
})
