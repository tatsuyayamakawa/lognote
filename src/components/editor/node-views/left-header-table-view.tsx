"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

export function LeftHeaderTableView({ node }: NodeViewProps) {
  const { rows, cols, data } = node.attrs;
  const tableData = data || [];

  return (
    <NodeViewWrapper
      className="left-header-table-container"
      data-left-header-table=""
      contentEditable={false}
    >
      <div className="left-header-table-scroll-wrapper">
        <table className="left-header">
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: cols }).map((_, colIndex) => {
                  const content = tableData[rowIndex]?.[colIndex] || '';
                  return colIndex === 0 ? (
                    <th key={colIndex} scope="row">
                      {content}
                    </th>
                  ) : (
                    <td key={colIndex}>{content}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="left-header-table-scroll-hint">
        ←→ スクロール可能
      </div>
    </NodeViewWrapper>
  );
}
