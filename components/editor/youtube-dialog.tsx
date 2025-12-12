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

interface YoutubeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (url: string) => void;
}

export function YoutubeDialog({ open, onOpenChange, onInsert }: YoutubeDialogProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!open) {
      setUrl("");
    }
  }, [open]);

  const handleInsert = () => {
    if (!url) return;
    onInsert(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>YouTube動画を挿入</DialogTitle>
          <DialogDescription>
            YouTubeのURLまたは短縮URLを入力してください
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-url">YouTube URL *</Label>
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=... または https://youtu.be/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && url) {
                  handleInsert();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              通常のURLと短縮URL（youtu.be）の両方に対応しています
            </p>
          </div>
        </div>

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
