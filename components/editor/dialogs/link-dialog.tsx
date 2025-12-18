"use client";

import { useState } from "react";
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

  // 初期値を直接セット（initialDataがあればそれを使用、なければ空文字/external）
  const [url, setUrl] = useState(initialData?.href || "");
  const [text, setText] = useState(initialData?.text || "");
  const [linkTarget, setLinkTarget] = useState<"internal" | "external">(
    initialData?.href?.startsWith("/") ? "internal" : "external"
  );

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
    <Dialog
      key={initialData?.href || 'new'}
      open={open}
      onOpenChange={onOpenChange}
    >
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
