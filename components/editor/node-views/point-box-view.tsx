"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

export function PointBoxView({ node }: NodeViewProps) {
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

  return (
    <NodeViewWrapper
      className={`point-box ${config.class}`}
      data-point-box=""
      data-type={type}
    >
      <div className="point-box-header">
        <span className="point-box-icon">{config.icon}</span>
        <span className="point-box-label">{title || config.label}</span>
      </div>
      <div className="point-box-content">{content}</div>
    </NodeViewWrapper>
  );
}
