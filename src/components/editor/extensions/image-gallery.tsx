import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageGalleryView } from '../node-views/image-gallery-view'

export interface ImageGalleryOptions {
  HTMLAttributes: Record<string, string | number | boolean>
  enableNodeView?: boolean
}

export interface ImageGalleryImage {
  src: string
  alt?: string
  caption?: string
}

export interface ImageGalleryAttrs {
  images: ImageGalleryImage[]
  columns: number
  gap: number
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageGallery: {
      setImageGallery: (options: {
        images: ImageGalleryImage[]
        columns?: number
        gap?: number
      }) => ReturnType
      updateImageGallery: (options: {
        images: ImageGalleryImage[]
        columns?: number
        gap?: number
      }) => ReturnType
    }
  }
}

export const ImageGallery = Node.create<ImageGalleryOptions>({
  name: 'imageGallery',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      images: {
        default: [],
        parseHTML: element => {
          const imagesAttr = element.getAttribute('data-images')
          return imagesAttr ? JSON.parse(imagesAttr) : []
        },
        renderHTML: attributes => {
          if (!attributes.images) {
            return {}
          }
          return {
            'data-images': JSON.stringify(attributes.images),
          }
        },
      },
      columns: {
        default: 2,
        parseHTML: element => parseInt(element.getAttribute('data-columns') || '2'),
        renderHTML: attributes => {
          return {
            'data-columns': attributes.columns,
          }
        },
      },
      gap: {
        default: 16,
        parseHTML: element => parseInt(element.getAttribute('data-gap') || '16'),
        renderHTML: attributes => {
          return {
            'data-gap': attributes.gap,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-gallery"]',
      },
    ]
  },

  renderHTML({ node }) {
    const { images, columns, gap } = node.attrs as ImageGalleryAttrs

    return [
      'div',
      {
        'data-type': 'image-gallery',
        'data-images': JSON.stringify(images),
        'data-columns': columns,
        'data-gap': gap,
        class: 'image-gallery-wrapper my-6',
      },
      [
        'div',
        {
          class: 'grid',
          'data-columns': columns,
          style: `gap: ${gap}px; grid-template-columns: repeat(1, 1fr);`,
        },
        ...images.map((image: ImageGalleryImage) => [
          'div',
          { class: 'overflow-hidden rounded image-gallery-item' },
          [
            'img',
            {
              src: image.src,
              alt: image.alt || '',
              class: 'w-full h-auto object-cover my-0!',
            },
          ],
          ...(image.caption
            ? [
              [
                'p',
                { class: 'text-sm text-gray-600 dark:text-gray-400 mt-2 mb-0 text-center' },
                image.caption,
              ],
            ]
            : []),
        ]),
      ],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageGalleryView)
  },

  addCommands() {
    return {
      setImageGallery:
        options =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: options,
            })
          },
      updateImageGallery:
        options =>
          ({ commands }) => {
            return commands.updateAttributes(this.name, options)
          },
    }
  },
})
