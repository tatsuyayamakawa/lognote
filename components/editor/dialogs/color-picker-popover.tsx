"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerPopoverProps {
  currentColor?: string;
  onColorChange: (color: string) => void;
  disabled?: boolean;
}

const DEFAULT_COLORS = [
  { name: "赤", value: "#dc2626" },
  { name: "青", value: "#2563eb" },
  { name: "緑", value: "#16a34a" },
  { name: "黄", value: "#ca8a04" },
  { name: "紫", value: "#9333ea" },
  { name: "ピンク", value: "#db2777" },
] as const;

const STORAGE_KEY = "tiptap-custom-colors";

// localStorageから安全に読み込む関数
const loadCustomColors = (): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load custom colors:", error);
  }
  return [];
};

export function ColorPickerPopover({
  currentColor,
  onColorChange,
  disabled = false,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = useState(false);
  // 初期値としてlocalStorageから読み込む（クライアントサイドのみ）
  const [customColors, setCustomColors] = useState<string[]>(() => loadCustomColors());
  const [newColor, setNewColor] = useState("#000000");

  // カスタムカラーを保存
  const saveCustomColor = useCallback((color: string) => {
    if (!color || typeof window === "undefined") return;

    setCustomColors((prev) => {
      if (prev.includes(color)) return prev;

      const updated = [...prev, color];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save custom color:", error);
      }
      return updated;
    });
  }, []);

  // カスタムカラーを削除
  const removeCustomColor = useCallback((color: string) => {
    if (typeof window === "undefined") return;

    setCustomColors((prev) => {
      const updated = prev.filter((c) => c !== color);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to remove custom color:", error);
      }
      return updated;
    });
  }, []);

  // カラーを適用
  const applyColor = useCallback(
    (color: string, closePopover = true) => {
      onColorChange(color);
      if (closePopover) {
        setOpen(false);
      }
    },
    [onColorChange]
  );

  // カスタムカラーを追加して適用
  const handleAddColor = useCallback(() => {
    if (!newColor) return;
    saveCustomColor(newColor);
    applyColor(newColor, false);
  }, [newColor, saveCustomColor, applyColor]);

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
              aria-hidden="true"
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
                  aria-label={`${color.name}を選択`}
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
                      aria-label={`カスタムカラー ${color} を選択`}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCustomColor(color);
                      }}
                      className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
                      aria-label={`カラー ${color} を削除`}
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
                aria-label="カラーピッカー"
              />
              <Input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="#000000"
                className="flex-1"
                aria-label="カラーコード"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddColor}
                disabled={!newColor || customColors.includes(newColor)}
                aria-label="カラーを追加"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
