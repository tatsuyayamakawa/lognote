import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { LeftHeaderTableView } from '../node-views/left-header-table-view'

export interface LeftHeaderTableOptions {
  HTMLAttributes: Record<string, unknown>
  enableNodeView?: boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    leftHeaderTable: {
      setLeftHeaderTable: (options: {
        rows: number
        cols: number
        data?: string[][]
      }) => ReturnType
    }
  }
}

export const LeftHeaderTable = Node.create<LeftHeaderTableOptions>({
  name: 'leftHeaderTable',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      rows: {
        default: 3,
      },
      cols: {
        default: 2,
      },
      data: {
        default: [],
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-left-header-table]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    const { rows, cols, data } = node.attrs
    const tableData = data || []

    // テーブルの行を生成
    const tableRows = []
    for (let i = 0; i < rows; i++) {
      const cells = []
      for (let j = 0; j < cols; j++) {
        const cellContent = tableData[i]?.[j] || ''
        cells.push([
          j === 0 ? 'th' : 'td',
          { scope: j === 0 ? 'row' : undefined },
          cellContent,
        ])
      }
      tableRows.push(['tr', {}, ...cells])
    }

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-left-header-table': '',
        'class': 'left-header-table-wrapper',
      }),
      [
        'table',
        { class: 'left-header' },
        ['tbody', {}, ...tableRows],
      ],
    ]
  },

  addCommands() {
    return {
      setLeftHeaderTable:
        (options) =>
        ({ commands }) => {
          // デフォルトのデータを生成
          const defaultData = []
          for (let i = 0; i < options.rows; i++) {
            const row = []
            for (let j = 0; j < options.cols; j++) {
              row.push('')
            }
            defaultData.push(row)
          }

          return commands.insertContent({
            type: this.name,
            attrs: {
              rows: options.rows,
              cols: options.cols,
              data: options.data || defaultData,
            },
          })
        },
    }
  },

  addNodeView() {
    if (this.options.enableNodeView) {
      return ReactNodeViewRenderer(LeftHeaderTableView)
    }
    return null
  },
})
