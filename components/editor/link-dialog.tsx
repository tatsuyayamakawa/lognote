"use client";

import { useState, useEffect, startTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (data: {
    href: string;
    text?: string;
    linkTarget: "internal" | "external";
  }) => void;
  initialData?: {
    href: string;
    text?: string;
  };
}

export function LinkDialog({
  open,
  onOpenChange,
  onInsert,
  initialData,
}: LinkDialogProps) {
  // 初期データがある場合は編集モード
  const isEditMode = !!initialData;

  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [linkTarget, setLinkTarget] = useState<"internal" | "external">(
    "external"
  );

  useEffect(() => {
    if (open && initialData) {
      // 編集モードの場合は初期データをセット（startTransitionでラップ）
      startTransition(() => {
        setUrl(initialData.href || "");
        setText(initialData.text || "");
        setLinkTarget(
          initialData.href?.startsWith("/") ? "internal" : "external"
        );
      });
    } else if (!open) {
      // ダイアログが閉じたらリセット（startTransitionでラップ）
      startTransition(() => {
        setUrl("");
        setText("");
        setLinkTarget("external");
      });
    }
  }, [open, initialData]);

  const handleInsert = () => {
    if (!url) return;

    onInsert({
      href: url,
      text: text || url,
      linkTarget,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "リンクを編集" : "リンクを挿入"}
          </DialogTitle>
          <DialogDescription>
            リンクの種類とURLを設定してください
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>リンクの種類 *</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={linkTarget === "internal" ? "default" : "outline"}
                onClick={() => setLinkTarget("internal")}
                className="flex-1"
              >
                内部リンク
              </Button>
              <Button
                type="button"
                variant={linkTarget === "external" ? "default" : "outline"}
                onClick={() => setLinkTarget("external")}
                className="flex-1"
              >
                外部リンク
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {linkTarget === "internal"
                ? "内部リンクは自動的にリンクカード形式で表示されます"
                : "外部リンクは通常のリンクとして表示されます"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              placeholder={
                linkTarget === "internal"
                  ? "/your-post-slug"
                  : "https://example.com"
              }
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          {linkTarget === "external" && (
            <div className="space-y-2">
              <Label htmlFor="text">リンクテキスト</Label>
              <Input
                id="text"
                placeholder="リンクテキスト（省略可）"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleInsert} disabled={!url}>
            {isEditMode ? "更新" : "挿入"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
