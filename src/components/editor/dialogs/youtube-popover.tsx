"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface YoutubePopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (url: string) => void;
  children: React.ReactNode;
}

export function YoutubePopover({ open, onOpenChange, onInsert, children }: YoutubePopoverProps) {
  const [url, setUrl] = useState("");

  const handleInsert = () => {
    if (!url) return;
    onInsert(url);
    setUrl("");
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setUrl("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">YouTube動画を挿入</h4>
            <p className="text-sm text-muted-foreground">
              YouTubeのURLまたは短縮URLを入力してください
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube-url">YouTube URL</Label>
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && url) {
                  e.preventDefault();
                  handleInsert();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              通常のURLと短縮URL（youtu.be）の両方に対応
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleInsert}
              disabled={!url}
            >
              挿入
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
