import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { InstagramView } from '../node-views/instagram-view';

export interface InstagramOptions {
  HTMLAttributes: Record<string, unknown>;
  enableNodeView: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    instagram: {
      setInstagram: (options: { url: string }) => ReturnType;
    };
  }
}

export const Instagram = Node.create<InstagramOptions>({
  name: 'instagram',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      enableNodeView: false,
    };
  },

  addAttributes() {
    return {
      url: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'blockquote[class="instagram-media"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const url = node.attrs.url;
    
    // Instagram埋め込みコードのHTML構造
    return [
      'blockquote',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'instagram-media',
        'data-instgrm-permalink': url,
        'data-instgrm-version': '14',
        style: 'background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);',
      }),
      [
        'div',
        { style: 'padding:16px;' },
        [
          'a',
          {
            href: url,
            style: 'background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'View this post on Instagram',
        ],
      ],
    ];
  },

  addCommands() {
    return {
      setInstagram:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addNodeView() {
    if (this.options.enableNodeView) {
      return ReactNodeViewRenderer(InstagramView);
    }
    return null;
  },
});
