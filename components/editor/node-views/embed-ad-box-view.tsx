"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

export function EmbedAdBoxView({ node, getPos, editor }: NodeViewProps) {
  const { embedCode } = node.attrs;

  const handleDoubleClick = () => {
    if (typeof getPos === 'function') {
      const pos = getPos();
      if (pos !== undefined) {
        editor.chain().focus().setTextSelection(pos).run();

        // Dispatch custom event to open edit dialog
        window.dispatchEvent(new CustomEvent('edit-embed-ad-box', {
          detail: { pos, attrs: node.attrs }
        }));
      }
    }
  };

  return (
    <NodeViewWrapper
      className="embed-ad-box"
      data-embed-ad-box=""
      contentEditable={false}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="embed-ad-box-content"
        dangerouslySetInnerHTML={{ __html: embedCode }}
      />
    </NodeViewWrapper>
  );
}
