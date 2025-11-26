"use client";

import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";

export function SpeechBubbleView({ node }: NodeViewProps) {
  const { position } = node.attrs;

  return (
    <NodeViewWrapper>
      <div className="speech-bubble" data-position={position}>
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  );
}
