"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Palette, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  currentColor?: string
  onColorChange: (color: string) => void
  disabled?: boolean
}

const DEFAULT_COLORS = [
  { name: "赤", value: "#dc2626" },
  { name: "青", value: "#2563eb" },
  { name: "緑", value: "#16a34a" },
  { name: "黄", value: "#ca8a04" },
  { name: "紫", value: "#9333ea" },
  { name: "ピンク", value: "#db2777" },
]

const STORAGE_KEY = "tiptap-custom-colors"

export function ColorPicker({
  currentColor,
  onColorChange,
  disabled = false,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const [customColors, setCustomColors] = useState<string[]>([])
  const [newColor, setNewColor] = useState("#000000")

  // カスタムカラーをlocalStorageから読み込む
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setCustomColors(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load custom colors:", e)
      }
    }
  }, [])

  // カスタムカラーを保存
  const saveCustomColor = (color: string) => {
    if (!color || customColors.includes(color)) return

    const updated = [...customColors, color]
    setCustomColors(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  // カスタムカラーを削除
  const removeCustomColor = (color: string) => {
    const updated = customColors.filter((c) => c !== color)
    setCustomColors(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  // カラーを適用
  const applyColor = (color: string, closePopover = true) => {
    onColorChange(color)
    if (closePopover) {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          title="文字色"
          className="relative"
        >
          <Palette className="h-4 w-4" />
          {currentColor && (
            <span
              className="absolute bottom-0 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full"
              style={{ backgroundColor: currentColor }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-3">
          {/* デフォルトカラーパレット */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              デフォルトカラー
            </p>
            <div className="grid grid-cols-6 gap-2">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => applyColor(color.value)}
                  className={cn(
                    "h-8 w-8 rounded border-2 transition-all hover:scale-110",
                    currentColor === color.value
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-border"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* カスタムカラーパレット */}
          {customColors.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                保存した色
              </p>
              <div className="grid grid-cols-6 gap-2">
                {customColors.map((color) => (
                  <div key={color} className="relative group">
                    <button
                      type="button"
                      onClick={() => applyColor(color)}
                      className={cn(
                        "h-8 w-8 rounded border-2 transition-all hover:scale-110",
                        currentColor === color
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border"
                      )}
                      style={{ backgroundColor: color }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeCustomColor(color)
                      }}
                      className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* カスタムカラー追加 */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              カスタムカラーを追加
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="h-9 w-16 cursor-pointer"
              />
              <Input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  saveCustomColor(newColor)
                  applyColor(newColor, false)
                }}
                disabled={!newColor || customColors.includes(newColor)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
