import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { SpeechBubbleView } from '../node-views/speech-bubble-view'

export interface SpeechBubbleOptions {
  HTMLAttributes: Record<string, unknown>
  enableNodeView?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    speechBubble: {
      setSpeechBubble: (position: 'left' | 'right') => ReturnType
      toggleSpeechBubble: (position: 'left' | 'right') => ReturnType
    }
  }
}

export const SpeechBubble = Node.create<SpeechBubbleOptions>({
  name: 'speechBubble',

  group: 'block',

  content: 'inline*',

  addAttributes() {
    return {
      position: {
        default: 'left',
        parseHTML: (element) => element.getAttribute('data-position'),
        renderHTML: (attributes) => {
          return {
            'data-position': attributes.position,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-speech-bubble]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-speech-bubble': '',
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setSpeechBubble:
        (position) =>
        ({ commands }) => {
          return commands.setNode(this.name, { position })
        },
      toggleSpeechBubble:
        (position) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', { position })
        },
    }
  },

  addNodeView() {
    if (this.options.enableNodeView) {
      return ReactNodeViewRenderer(SpeechBubbleView)
    }
    return null
  },
})
