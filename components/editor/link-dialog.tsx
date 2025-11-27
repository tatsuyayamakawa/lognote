"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (data: {
    href: string;
    text?: string;
    type: "simple" | "card";
    linkTarget?: "internal" | "external";
  }) => void;
}

export function LinkDialog({ open, onOpenChange, onInsert }: LinkDialogProps) {
  const [linkType, setLinkType] = useState<"simple" | "card">("simple");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [linkTarget, setLinkTarget] = useState<"internal" | "external">("external");

  useEffect(() => {
    if (!open) {
      // ダイアログが閉じたらリセット
      setUrl("");
      setText("");
      setLinkType("simple");
      setLinkTarget("external");
    }
  }, [open]);

  const handleInsert = () => {
    if (!url) return;

    onInsert({
      href: url,
      text: text || url,
      type: linkType,
      linkTarget: linkType === "simple" ? linkTarget : undefined,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>リンクを挿入</DialogTitle>
          <DialogDescription>
            リンクの種類とURLを設定してください
          </DialogDescription>
        </DialogHeader>

        <Tabs value={linkType} onValueChange={(v) => setLinkType(v as "simple" | "card")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">通常リンク</TabsTrigger>
            <TabsTrigger value="card">リンクカード</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-4 mt-4">
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="simple-url">URL *</Label>
              <Input
                id="simple-url"
                placeholder={linkTarget === "internal" ? "/your-post-slug" : "https://example.com"}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="simple-text">リンクテキスト</Label>
              <Input
                id="simple-text"
                placeholder="リンクテキスト（省略可）"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="card" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="card-url">記事のスラッグ *</Label>
              <Input
                id="card-url"
                placeholder="/your-post-slug"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                内部記事のスラッグ（例: /your-post-slug）を入力してください。
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleInsert} disabled={!url}>
            挿入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
