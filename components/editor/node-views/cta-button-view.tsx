"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

export function CtaButtonView({ node }: NodeViewProps) {
  const { href, text, variant } = node.attrs;

  // バリアントに応じたクラスを設定
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  };

  const buttonClass = variantClasses[variant as keyof typeof variantClasses] || variantClasses.primary;

  return (
    <NodeViewWrapper className="flex justify-center my-8">
      <a
        href={href || "#"}
        className={`inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold transition-colors ${buttonClass} shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-200`}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {text || 'クリックして詳細を見る'}
      </a>
    </NodeViewWrapper>
  );
}
