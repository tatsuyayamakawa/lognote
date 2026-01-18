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
          if (!imagesAttr) return []

          const parsedImages = JSON.parse(imagesAttr)
          // 各画像オブジェクトから、存在するフィールドのみを保持
          return parsedImages.map((img: ImageGalleryImage) => {
            const result: Partial<ImageGalleryImage> = { src: img.src };
            if (img.alt && img.alt.trim()) result.alt = img.alt;
            if (img.caption && img.caption.trim()) result.caption = img.caption;
            return result;
          })
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
        ...images.map((image: ImageGalleryImage) => {
          const elements: (string | Record<string, string> | unknown[])[] = [
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
          ];

          // キャプションがあれば追加
          if (image.caption && image.caption.trim()) {
            elements.push([
              'p',
              { class: 'text-sm text-gray-600 dark:text-gray-400 mt-2 mb-0 text-center' },
              image.caption,
            ]);
          }

          return elements;
        }),
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
            // undefinedのフィールドを除外してクリーンなデータを作成
            const cleanedOptions = {
              ...options,
              images: options.images.map((img: ImageGalleryImage) => {
                const cleanedImg: Partial<ImageGalleryImage> = { src: img.src };
                if (img.alt !== undefined && img.alt.trim()) cleanedImg.alt = img.alt;
                if (img.caption !== undefined && img.caption.trim()) cleanedImg.caption = img.caption;
                return cleanedImg;
              })
            };
            return commands.insertContent({
              type: this.name,
              attrs: cleanedOptions,
            })
          },
      updateImageGallery:
        options =>
          ({ state, dispatch }) => {
            // undefinedのフィールドを除外してクリーンなデータを作成
            const cleanedOptions = {
              ...options,
              images: options.images.map((img: ImageGalleryImage) => {
                const cleanedImg: Partial<ImageGalleryImage> = { src: img.src };
                if (img.alt !== undefined && img.alt.trim()) cleanedImg.alt = img.alt;
                if (img.caption !== undefined && img.caption.trim()) cleanedImg.caption = img.caption;
                return cleanedImg;
              })
            };

            // JSON経由でシリアライズして、完全にクリーンなデータを作成
            const serialized = JSON.stringify(cleanedOptions);
            const deserialized = JSON.parse(serialized);

            // 現在のimageGalleryノードを見つける
            let nodePos: number | null = null;

            state.doc.descendants((node, pos) => {
              if (node.type.name === this.name) {
                nodePos = pos;
                return false;
              }
            });

            if (nodePos === null) {
              return false;
            }

            // 見つかった位置でノードを置き換える
            const node = state.schema.nodes[this.name].create(deserialized);
            const transaction = state.tr.replaceRangeWith(
              nodePos,
              nodePos + state.doc.nodeAt(nodePos)!.nodeSize,
              node
            );

            if (dispatch) {
              dispatch(transaction);
            }

            return true;
          },
    }
  },
})
