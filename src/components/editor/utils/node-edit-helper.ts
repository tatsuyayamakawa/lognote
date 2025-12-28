/**
 * ノードビューのダブルクリック編集を処理するヘルパー関数
 */

import type { NodeViewProps } from '@tiptap/react';

interface DispatchEditEventOptions {
  /** カスタムイベント名 (例: 'edit-cta-button') */
  eventName: string;
  /** ノードビューのprops */
  nodeViewProps: NodeViewProps;
  /** イベント発火前にエディタにフォーカスするかどうか */
  focusEditor?: boolean;
  /** エディタモードかどうかのチェック（オプション） */
  isEditorMode?: boolean;
}

/**
 * ノードビューのダブルクリック編集イベントをディスパッチする
 *
 * @example
 * const handleDoubleClick = createNodeEditHandler({
 *   eventName: 'edit-cta-button',
 *   nodeViewProps: { node, getPos, editor }
 * });
 */
export function createNodeEditHandler(options: DispatchEditEventOptions) {
  return () => {
    const { eventName, nodeViewProps, focusEditor = false, isEditorMode = true } = options;
    const { node, getPos, editor } = nodeViewProps;

    // エディタモードチェック
    if (!isEditorMode) {
      return;
    }

    // getPos が関数であることを確認
    if (typeof getPos !== 'function') {
      return;
    }

    const pos = getPos();

    // 位置が有効な数値であることを確認
    if (typeof pos !== 'number') {
      return;
    }

    // オプション: エディタにフォーカスしてテキスト選択を設定
    if (focusEditor && editor) {
      editor.chain().focus().setTextSelection(pos).run();
    }

    // カスタムイベントをディスパッチ
    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          pos,
          attrs: node.attrs,
        },
      })
    );
  };
}

/**
 * 各ノードタイプ用の便利な関数
 */
export const createCtaButtonEditHandler = (nodeViewProps: NodeViewProps) =>
  createNodeEditHandler({
    eventName: 'edit-cta-button',
    nodeViewProps,
    focusEditor: false,
  });

export const createProductLinkBoxEditHandler = (nodeViewProps: NodeViewProps) =>
  createNodeEditHandler({
    eventName: 'edit-product-link-box',
    nodeViewProps,
    focusEditor: true,
  });

export const createEmbedAdBoxEditHandler = (nodeViewProps: NodeViewProps, isEditorMode: boolean) =>
  createNodeEditHandler({
    eventName: 'edit-embed-ad-box',
    nodeViewProps,
    focusEditor: true,
    isEditorMode,
  });

export const createImageGalleryEditHandler = (nodeViewProps: NodeViewProps, isEditorMode: boolean) =>
  createNodeEditHandler({
    eventName: 'edit-image-gallery',
    nodeViewProps,
    focusEditor: true,
    isEditorMode,
  });

export const createCustomImageEditHandler = (nodeViewProps: NodeViewProps) =>
  createNodeEditHandler({
    eventName: 'edit-custom-image',
    nodeViewProps,
    focusEditor: false,
  });
