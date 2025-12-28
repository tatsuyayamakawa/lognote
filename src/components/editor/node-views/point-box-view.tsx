"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

export function PointBoxView({ node, getPos }: NodeViewProps) {
  const { type, title, content } = node.attrs;

  // タイプに応じたアイコンとラベル
  const typeConfig = {
    point: { icon: '💡', label: 'ポイント', class: 'point-box-point' },
    warning: { icon: '⚠️', label: '注意', class: 'point-box-warning' },
    danger: { icon: '🚨', label: '危険', class: 'point-box-danger' },
    success: { icon: '✅', label: 'ヒント', class: 'point-box-success' },
    info: { icon: 'ℹ️', label: '情報', class: 'point-box-info' },
  };

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.point;

  // ダブルクリックで編集ダイアログを開く
  const handleDoubleClick = () => {
    const pos = typeof getPos === 'function' ? getPos() : 0;
    window.dispatchEvent(
      new CustomEvent('edit-point-box', {
        detail: {
          pos,
          attrs: node.attrs,
        },
      })
    );
  };

  return (
    <NodeViewWrapper
      className={`point-box ${config.class} group relative cursor-pointer`}
      data-point-box=""
      data-type={type}
      contentEditable={false}
      onDoubleClick={handleDoubleClick}
    >
      <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-medium pointer-events-none">
        ダブルクリックで編集
      </div>
      <div className="point-box-header">
        <span className="point-box-icon">{config.icon}</span>
        <span className="point-box-label">{title || config.label}</span>
      </div>
      <div className="point-box-content">{content}</div>
    </NodeViewWrapper>
  );
}
