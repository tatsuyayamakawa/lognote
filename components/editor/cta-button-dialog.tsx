"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CtaButtonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (options: {
    href: string;
    text: string;
    variant: "primary" | "secondary" | "outline";
    bgColor?: string;
    textColor?: string;
    animation?: "none" | "pulse" | "bounce" | "shine" | "glow";
  }) => void;
  initialData?: {
    href: string;
    text: string;
    variant: "primary" | "secondary" | "outline";
    bgColor?: string;
    textColor?: string;
    animation?: "none" | "pulse" | "bounce" | "shine" | "glow";
  };
}

export function CtaButtonDialog({
  open,
  onOpenChange,
  onSelect,
  initialData,
}: CtaButtonDialogProps) {
  const [href, setHref] = useState(initialData?.href || "");
  const [text, setText] = useState(initialData?.text || "");
  const [bgColor, setBgColor] = useState(initialData?.bgColor || "#3b82f6");
  const [textColor, setTextColor] = useState(
    initialData?.textColor || "#ffffff"
  );
  const [animation, setAnimation] = useState<
    "none" | "pulse" | "bounce" | "shine" | "glow"
  >(initialData?.animation || "none");

  // 初期データがある場合は編集モード
  const isEditMode = !!initialData;

  // openとinitialDataが変わったらstateを更新
  useEffect(() => {
    if (open && initialData) {
      setHref(initialData.href || "");
      setText(initialData.text || "");
      setBgColor(initialData.bgColor || "#3b82f6");
      setTextColor(initialData.textColor || "#ffffff");
      setAnimation(initialData.animation || "none");
    } else if (!open) {
      // ダイアログが閉じたらリセット
      setHref("");
      setText("");
      setBgColor("#3b82f6");
      setTextColor("#ffffff");
      setAnimation("none");
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!href || !text) return;

    onSelect({
      href,
      text,
      variant: "primary",
      bgColor,
      textColor,
      animation,
    });

    handleClose();
  };

  const handleClose = () => {
    setHref("");
    setText("");
    setBgColor("#3b82f6");
    setTextColor("#ffffff");
    setAnimation("none");
    onOpenChange(false);
  };

  // カラーパレット
  const colorPresets = [
    { name: "ブルー", bg: "#3b82f6", text: "#ffffff" },
    { name: "スカイ", bg: "#0ea5e9", text: "#ffffff" },
    { name: "ティール", bg: "#14b8a6", text: "#ffffff" },
    { name: "グリーン", bg: "#10b981", text: "#ffffff" },
    { name: "ライム", bg: "#84cc16", text: "#000000" },
    { name: "イエロー", bg: "#eab308", text: "#000000" },
    { name: "オレンジ", bg: "#f97316", text: "#ffffff" },
    { name: "レッド", bg: "#ef4444", text: "#ffffff" },
    { name: "ピンク", bg: "#ec4899", text: "#ffffff" },
    { name: "パープル", bg: "#a855f7", text: "#ffffff" },
    { name: "インディゴ", bg: "#6366f1", text: "#ffffff" },
    { name: "グレー", bg: "#6b7280", text: "#ffffff" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[340px] p-4">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "CTAボタンを編集" : "CTAボタンを挿入"}
          </DialogTitle>
          <DialogDescription>
            クリックを促進するボタンリンクを{isEditMode ? "編集" : "挿入"}します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="text">ボタンテキスト</Label>
            <Input
              id="text"
              placeholder="今すぐ無料で試す"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="href">リンク先URL</Label>
            <Input
              id="href"
              type="url"
              placeholder="https://example.com"
              value={href}
              onChange={(e) => setHref(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>カラー</Label>
            <div className="grid grid-cols-6 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setBgColor(preset.bg);
                    setTextColor(preset.text);
                  }}
                  className="h-8 w-full rounded border-2 transition-all hover:scale-110 border-border"
                  style={{ backgroundColor: preset.bg }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="animation">アニメーション効果</Label>
            <Select
              value={animation}
              onValueChange={(value) => setAnimation(value as typeof animation)}
            >
              <SelectTrigger id="animation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">なし</SelectItem>
                <SelectItem value="pulse">パルス（ゆっくり点滅）</SelectItem>
                <SelectItem value="bounce">バウンス（弾む）</SelectItem>
                <SelectItem value="shine">シャイン（光沢）</SelectItem>
                <SelectItem value="glow">グロー（発光）</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* プレビュー */}
          {text && (
            <div className="space-y-2">
              <Label>プレビュー</Label>
              <div className="flex justify-center rounded-lg border bg-muted/50 p-4">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className={`w-full inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center ${
                    animation === "pulse"
                      ? "animate-pulse-slow"
                      : animation === "bounce"
                      ? "animate-bounce-slow"
                      : animation === "shine"
                      ? "cta-shine"
                      : animation === "glow"
                      ? "cta-glow"
                      : ""
                  }`}
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    textDecoration: "none",
                  }}
                >
                  {text}
                </a>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!href || !text}
          >
            {isEditMode ? "更新" : "挿入"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
