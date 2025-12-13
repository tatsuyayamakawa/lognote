import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'

export interface CustomImageOptions {
  inline: boolean
  allowBase64: boolean
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: {
        src: string
        alt?: string
        title?: string
        caption?: string
      }) => ReturnType
    }
  }
}

export const CustomImage = Image.extend<CustomImageOptions>({
  name: 'customImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        parseHTML: element => element.getAttribute('data-caption'),
        renderHTML: attributes => {
          if (!attributes.caption) {
            return {}
          }
          return {
            'data-caption': attributes.caption,
          }
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomImageComponent)
  },
})

function CustomImageComponent({ node, deleteNode }: any) {
  const { src, alt, caption } = node.attrs

  return (
    <NodeViewWrapper className="my-4">
      <figure className="relative group">
        {deleteNode && (
          <button
            onClick={deleteNode}
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded p-1 text-xs hover:bg-red-600"
            contentEditable={false}
          >
            削除
          </button>
        )}
        <img
          src={src}
          alt={alt || ''}
          className="rounded-lg w-full h-auto"
        />
        {caption && (
          <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            {caption}
          </figcaption>
        )}
      </figure>
    </NodeViewWrapper>
  )
}
