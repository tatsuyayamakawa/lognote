"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

export function EmbedAdBoxView({ node }: NodeViewProps) {
  const { embedCode } = node.attrs;

  return (
    <NodeViewWrapper className="embed-ad-box" data-embed-ad-box="">
      <div
        className="embed-ad-box-content"
        dangerouslySetInnerHTML={{ __html: embedCode }}
      />
    </NodeViewWrapper>
  );
}
