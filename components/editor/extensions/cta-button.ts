import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { CtaButtonView } from '../node-views/cta-button-view'

export interface CtaButtonOptions {
  HTMLAttributes: Record<string, unknown>
  enableNodeView?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ctaButton: {
      setCtaButton: (options: {
        href: string
        text: string
        variant?: 'primary' | 'secondary' | 'outline'
      }) => ReturnType
    }
  }
}

export const CtaButton = Node.create<CtaButtonOptions>({
  name: 'ctaButton',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      href: {
        default: null,
      },
      text: {
        default: 'クリックして詳細を見る',
      },
      variant: {
        default: 'primary',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-cta-button]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { href, text, variant } = node.attrs

    // バリアントに応じたクラスを設定
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
    }

    const buttonClass = variantClasses[variant as keyof typeof variantClasses] || variantClasses.primary

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-cta-button': '',
        'class': 'flex justify-center my-8',
      }),
      [
        'a',
        {
          href: href || '#',
          class: `inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold transition-colors ${buttonClass} shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-200`,
          target: href?.startsWith('http') ? '_blank' : undefined,
          rel: href?.startsWith('http') ? 'noopener noreferrer' : undefined,
        },
        text || 'クリックして詳細を見る',
      ]
    ]
  },

  addCommands() {
    return {
      setCtaButton:
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
      return ReactNodeViewRenderer(CtaButtonView)
    }
    return null
  },
})
