import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

export interface ImageGalleryOptions {
  HTMLAttributes: Record<string, any>
  enableNodeView?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageGallery: {
      setImageGallery: (options: {
        images: Array<{ src: string; alt?: string; caption?: string }>
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
    const { images, columns, gap } = node.attrs

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
        ...images.map((image: any) => [
          'div',
          { class: 'overflow-hidden rounded cursor-zoom-in image-gallery-item' },
          [
            'img',
            {
              src: image.src,
              alt: image.alt || '',
              class: 'w-full h-auto object-cover hover:opacity-90 transition-opacity my-0!',
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
    if (this.options.enableNodeView === false) {
      return null
    }
    return ReactNodeViewRenderer(ImageGalleryComponent)
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
    }
  },
})

function ImageGalleryComponent({ node, deleteNode, getPos }: any) {
  const { images, columns, gap } = node.attrs
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt?: string; caption?: string } | null>(null)

  const handleDoubleClick = () => {
    const pos = getPos()
    if (typeof pos === 'number') {
      // カスタムイベントを発火して編集ダイアログを開く
      window.dispatchEvent(
        new CustomEvent('edit-image-gallery', {
          detail: {
            pos,
            attrs: node.attrs,
          },
        })
      )
    }
  }

  const handleImageClick = (image: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImage(image)
  }

  return (
    <NodeViewWrapper className="image-gallery-wrapper my-6">
      <div className="relative group">
        {deleteNode && (
          <button
            onClick={deleteNode}
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded p-1 text-xs hover:bg-red-600"
            contentEditable={false}
          >
            削除
          </button>
        )}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 cursor-pointer"
          style={{
            gridTemplateColumns: `repeat(1, 1fr)`,
            gap: `${gap}px`,
          }}
          data-columns={columns}
          onDoubleClick={handleDoubleClick}
        >
          <style>{`
            [data-columns="1"] { grid-template-columns: repeat(1, 1fr) !important; }
            [data-columns="2"] { grid-template-columns: repeat(1, 1fr); }
            @media (min-width: 768px) {
              [data-columns="2"] { grid-template-columns: repeat(2, 1fr) !important; }
              [data-columns="3"] { grid-template-columns: repeat(2, 1fr) !important; }
              [data-columns="4"] { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (min-width: 1024px) {
              [data-columns="3"] { grid-template-columns: repeat(3, 1fr) !important; }
              [data-columns="4"] { grid-template-columns: repeat(3, 1fr) !important; }
            }
            @media (min-width: 1280px) {
              [data-columns="4"] { grid-template-columns: repeat(4, 1fr) !important; }
            }
          `}</style>
          {images.map((image: any, index: number) => (
            <div
              key={index}
              className="overflow-hidden rounded cursor-zoom-in"
              onClick={(e) => handleImageClick(image, e)}
            >
              <img
                src={image.src}
                alt={image.alt || ''}
                className="w-full h-auto object-cover hover:opacity-90 transition-opacity my-0!"
              />
              {image.caption && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center mb-0">
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 画像拡大ダイアログ */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden">
          <DialogTitle className="sr-only">画像を拡大表示</DialogTitle>
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt || ''}
                className="w-full h-auto max-h-[90vh] object-contain my-0"
              />
              {selectedImage.caption && (
                <div className="p-4 bg-background">
                  <p className="text-sm text-muted-foreground text-center">
                    {selectedImage.caption}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </NodeViewWrapper>
  )
}
