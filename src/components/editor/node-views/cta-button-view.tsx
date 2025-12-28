"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { createCtaButtonEditHandler } from "../utils/node-edit-helper";
import { Button } from "@/components/ui/button";

export function CtaButtonView(props: NodeViewProps) {
  const { node, deleteNode, editor } = props;
  const { href, text, variant, bgColor, textColor, animation } = node.attrs;

  const isEditorMode = editor.isEditable;
  const handleDoubleClick = createCtaButtonEditHandler(props);

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
    <NodeViewWrapper
      className="flex justify-center my-8 relative group"
      data-cta-button=""
      contentEditable={false}
      onDoubleClick={handleDoubleClick}
    >
      {isEditorMode && deleteNode && (
        <Button
          onClick={deleteNode}
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-xs h-6 px-2"
          contentEditable={false}
        >
          削除
        </Button>
      )}
      {isEditorMode && (
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-medium pointer-events-none">
          ダブルクリックで編集
        </div>
      )}
      <a
        href={href}
        className={`inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold transition-all duration-300 min-w-[300px] ${buttonClass} ${animationClass} shadow-lg hover:shadow-xl transform hover:scale-105 pointer-events-none cursor-pointer`}
        style={bgColor || textColor ? style : undefined}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {text}
      </a>
    </NodeViewWrapper>
  );
}
