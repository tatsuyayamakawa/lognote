"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface LeftHeaderTableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsert: (data: {
    rows: number
    cols: number
    data: string[][]
  }) => void
}

export function LeftHeaderTableDialog({
  open,
  onOpenChange,
  onInsert,
}: LeftHeaderTableDialogProps) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(2)
  const [tableData, setTableData] = useState<string[][]>([
    ['項目1', '内容1'],
    ['項目2', '内容2'],
    ['項目3', '内容3'],
  ])

  const handleRowsChange = (newRows: number) => {
    if (newRows < 1 || newRows > 20) return
    setRows(newRows)

    // データを調整
    const newData = [...tableData]
    while (newData.length < newRows) {
      newData.push(Array(cols).fill(''))
    }
    while (newData.length > newRows) {
      newData.pop()
    }
    setTableData(newData)
  }

  const handleColsChange = (newCols: number) => {
    if (newCols < 2 || newCols > 10) return
    setCols(newCols)

    // データを調整
    const newData = tableData.map(row => {
      const newRow = [...row]
      while (newRow.length < newCols) {
        newRow.push('')
      }
      while (newRow.length > newCols) {
        newRow.pop()
      }
      return newRow
    })
    setTableData(newData)
  }

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData]
    if (!newData[rowIndex]) {
      newData[rowIndex] = Array(cols).fill('')
    }
    newData[rowIndex][colIndex] = value
    setTableData(newData)
  }

  const handleInsert = () => {
    onInsert({
      rows,
      cols,
      data: tableData,
    })

    // リセット
    setRows(3)
    setCols(2)
    setTableData([
      ['項目1', '内容1'],
      ['項目2', '内容2'],
      ['項目3', '内容3'],
    ])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>左端列見出しテーブルを挿入</DialogTitle>
          <DialogDescription>
            左端の列が見出しになるテーブルを作成します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* サイズ設定 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rows">行数 (1-20)</Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => handleRowsChange(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cols">列数 (2-10)</Label>
              <Input
                id="cols"
                type="number"
                min="2"
                max="10"
                value={cols}
                onChange={(e) => handleColsChange(parseInt(e.target.value) || 2)}
              />
            </div>
          </div>

          {/* テーブルプレビュー */}
          <div className="space-y-2">
            <Label>テーブルの内容</Label>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b last:border-b-0">
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className={`p-2 ${
                            colIndex === 0 ? 'bg-muted font-bold w-1/3' : ''
                          }`}
                        >
                          <Input
                            value={cell}
                            onChange={(e) =>
                              handleCellChange(rowIndex, colIndex, e.target.value)
                            }
                            placeholder={
                              colIndex === 0 ? `項目${rowIndex + 1}` : `内容${rowIndex + 1}`
                            }
                            className={colIndex === 0 ? 'font-bold' : ''}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button type="button" onClick={handleInsert}>
            挿入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
