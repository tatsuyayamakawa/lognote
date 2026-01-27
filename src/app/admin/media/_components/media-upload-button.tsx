"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, RefreshCw } from "lucide-react";
import { ImageUploadDialog } from "./image-upload-dialog";
import { useRouter } from "next/navigation";

export function MediaUploadButton() {
  const [open, setOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/admin/sync-images", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(`同期完了: ${data.synced}件追加, ${data.skipped}件スキップ`);
        router.refresh();
      } else {
        alert(`同期エラー: ${data.error}`);
      }
    } catch {
      alert("同期に失敗しました");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
      <Button
        variant="outline"
        onClick={handleSync}
        disabled={syncing}
        className="w-full sm:w-auto"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
        {syncing ? "同期中..." : "Storage同期"}
      </Button>
      <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
        <Upload className="mr-2 h-4 w-4" />
        画像をアップロード
      </Button>
      <ImageUploadDialog
        open={open}
        onOpenChange={setOpen}
        onUploadComplete={() => router.refresh()}
      />
    </div>
  );
}
