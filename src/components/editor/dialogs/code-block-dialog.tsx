"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CodeBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (filename: string, language: string) => void;
  initialData?: { filename?: string; language?: string };
}

export function CodeBlockDialog({
  open,
  onOpenChange,
  onInsert,
  initialData,
}: CodeBlockDialogProps) {
  const [filename, setFilename] = useState(initialData?.filename || "");
  const [language, setLanguage] = useState(initialData?.language || "");

  useEffect(() => {
    if (open) {
      setFilename(initialData?.filename || "");
      setLanguage(initialData?.language || "");
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    onInsert(filename, language);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>コードブロックの挿入</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="filename">ファイル名（任意）</Label>
            <Input
              id="filename"
              placeholder="例: index.tsx"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="language">言語（任意）</Label>
            <Input
              id="language"
              placeholder="例: typescript, javascript, python"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>挿入</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
