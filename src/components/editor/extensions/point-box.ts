import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { PointBoxView } from '../node-views/point-box-view'

export interface PointBoxOptions {
  HTMLAttributes: Record<string, unknown>
  enableNodeView?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pointBox: {
      setPointBox: (options: {
        type: 'point' | 'warning' | 'danger' | 'success' | 'info'
        title?: string
        content: string
      }) => ReturnType
    }
  }
}

export const PointBox = Node.create<PointBoxOptions>({
  name: 'pointBox',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      type: {
        default: 'point',
      },
      title: {
        default: null,
      },
      content: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-point-box]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { type, title, content } = node.attrs

    // タイプに応じたアイコンとラベル
    const typeConfig = {
      point: { icon: '💡', label: 'ポイント', class: 'point-box-point' },
      warning: { icon: '⚠️', label: '注意', class: 'point-box-warning' },
      danger: { icon: '🚨', label: '危険', class: 'point-box-danger' },
      success: { icon: '✅', label: 'ヒント', class: 'point-box-success' },
      info: { icon: 'ℹ️', label: '情報', class: 'point-box-info' },
    }

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.point

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-point-box': '',
        'data-type': type,
        'class': `point-box ${config.class}`,
      }),
      [
        'div',
        { class: 'point-box-header' },
        [
          'span',
          { class: 'point-box-icon' },
          config.icon,
        ],
        [
          'span',
          { class: 'point-box-label' },
          title || config.label,
        ],
      ],
      [
        'div',
        { class: 'point-box-content' },
        content || '',
      ],
    ]
  },

  addCommands() {
    return {
      setPointBox:
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
      return ReactNodeViewRenderer(PointBoxView)
    }
    return null
  },
})
