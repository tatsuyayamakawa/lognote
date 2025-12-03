"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

export function CtaButtonView({ node }: NodeViewProps) {
  const { href, text, variant, bgColor, textColor, animation } = node.attrs;

  // バリアントに応じたクラスを設定（カスタムカラーがない場合）
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  };

  // アニメーションクラス
  const animationClasses = {
    none: '',
    pulse: 'animate-pulse-slow',
    bounce: 'animate-bounce-slow',
    shine: 'cta-shine',
    glow: 'cta-glow',
  };

  const buttonClass = bgColor
    ? '' // カスタムカラーの場合はバリアントクラスを使わない
    : variantClasses[variant as keyof typeof variantClasses] || variantClasses.primary;

  const animationClass = animationClasses[animation as keyof typeof animationClasses] || '';

  // インラインスタイル
  const style: React.CSSProperties = {
    ...(bgColor && { backgroundColor: bgColor }),
    ...(textColor && { color: textColor }),
  };

  return (
    <NodeViewWrapper className="flex justify-center my-8" data-cta-button="">
      <a
        href={href || "#"}
        className={`inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold transition-all duration-300 min-w-[250px] ${buttonClass} ${animationClass} shadow-lg hover:shadow-xl transform hover:scale-105`}
        style={bgColor || textColor ? style : undefined}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {text || 'クリックして詳細を見る'}
      </a>
    </NodeViewWrapper>
  );
}
