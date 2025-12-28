"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdSettings } from "@/types/ad";
import { toast } from "sonner";
import { Monitor, Smartphone, GripVertical, Trash2, Save } from "lucide-react";

interface AdSettingsFormProps {
  initialSettings: AdSettings | null;
}

export function AdSettingsForm({ initialSettings }: AdSettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceView, setDeviceView] = useState<"pc" | "mobile">("pc");

  // 広告スロット状態
  const [adSlots, setAdSlots] = useState<Record<string, string>>({
    article_top_pc_slot: initialSettings?.article_top_pc_slot || "",
    article_top_mobile_slot: initialSettings?.article_top_mobile_slot || "",
    in_article_pc_slot_1: initialSettings?.in_article_pc_slot_1 || "",
    in_article_mobile_slot_1: initialSettings?.in_article_mobile_slot_1 || "",
    in_article_pc_slot_2: initialSettings?.in_article_pc_slot_2 || "",
    in_article_mobile_slot_2: initialSettings?.in_article_mobile_slot_2 || "",
    in_article_pc_slot_3: initialSettings?.in_article_pc_slot_3 || "",
    in_article_mobile_slot_3: initialSettings?.in_article_mobile_slot_3 || "",
    in_article_pc_slot_4: initialSettings?.in_article_pc_slot_4 || "",
    in_article_mobile_slot_4: initialSettings?.in_article_mobile_slot_4 || "",
    in_article_pc_slot_5: initialSettings?.in_article_pc_slot_5 || "",
    in_article_mobile_slot_5: initialSettings?.in_article_mobile_slot_5 || "",
    article_bottom_pc_slot: initialSettings?.article_bottom_pc_slot || "",
    article_bottom_mobile_slot: initialSettings?.article_bottom_mobile_slot || "",
    sidebar_pc_slot: initialSettings?.sidebar_pc_slot || "",
    sidebar_mobile_slot: initialSettings?.sidebar_mobile_slot || "",
  });

  const handleSlotChange = (slotId: string, value: string) => {
    setAdSlots((prev) => ({ ...prev, [slotId]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ad-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adSlots),
      });

      if (!response.ok) {
        throw new Error("Failed to save ad settings");
      }

      toast.success("広告設定を保存しました");
      router.refresh();
    } catch (error) {
      console.error("Error saving ad settings:", error);
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラー";
      toast.error(`広告設定の保存に失敗しました: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* デバイス切り替え */}
      <Tabs value={deviceView} onValueChange={(v) => setDeviceView(v as "pc" | "mobile")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pc" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            PC表示
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            スマホ表示
          </TabsTrigger>
        </TabsList>

        {/* PC表示 */}
        <TabsContent value="pc" className="mt-6">
          <div className="space-y-4">
            {/* 記事タイトル（1カラム） */}
            <Card className="border-2 border-dashed p-6">
              <div className="mb-2 text-sm font-semibold text-muted-foreground">
                記事ページ（PC）
              </div>
              <div className="rounded-lg bg-muted/30 p-8 text-center">
                <div className="text-2xl font-bold text-foreground">記事タイトル</div>
                <div className="mt-2 text-sm text-muted-foreground">公開日 | カテゴリ</div>
              </div>
            </Card>

            {/* タイトル下広告（1カラム） */}
            <Card className="border-2 border-dashed p-6">
              <AdSlotZone
                id="article_top_pc_slot"
                label="タイトル下広告"
                description="728×90 (横長バナー)"
                value={adSlots.article_top_pc_slot}
                onChange={handleSlotChange}
                height="90px"
              />
            </Card>

            {/* コンテンツ + サイドバー（2カラム） */}
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* メインコンテンツエリア */}
              <div className="space-y-4">
                <Card className="border-2 border-dashed p-6">
                  {/* 記事コンテンツ */}
                  <div className="rounded-lg bg-muted/30 p-6">
                    <div className="mb-3 text-lg font-bold text-foreground">## 見出し1</div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="h-2 bg-muted-foreground/20 rounded" />
                      <div className="h-2 bg-muted-foreground/20 rounded" />
                      <div className="h-2 bg-muted-foreground/20 rounded w-4/5" />
                    </div>
                  </div>

                  {/* 記事内広告 1〜2 */}
                  {[
                    { position: 1, h2Position: 2 },
                    { position: 2, h2Position: 4 },
                  ].map(({ position, h2Position }) => (
                    <AdSlotZone
                      key={`in_article_pc_slot_${position}`}
                      id={`in_article_pc_slot_${position}`}
                      label={`記事内広告 ${position}（${h2Position}つ目のH2前）`}
                      description="記事内広告（fluid）"
                      value={adSlots[`in_article_pc_slot_${position}`]}
                      onChange={handleSlotChange}
                      height="280px"
                    />
                  ))}

                  {/* 記事コンテンツ続き */}
                  <div className="rounded-lg bg-muted/30 p-6 mt-6">
                    <div className="mb-3 text-lg font-bold text-foreground">## 見出し2</div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="h-2 bg-muted-foreground/20 rounded" />
                      <div className="h-2 bg-muted-foreground/20 rounded" />
                      <div className="h-2 bg-muted-foreground/20 rounded w-3/4" />
                    </div>
                  </div>

                  {/* コンテンツ後広告 */}
                  <AdSlotZone
                    id="article_bottom_pc_slot"
                    label="コンテンツ後広告"
                    description="記事内広告（fluid）"
                    value={adSlots.article_bottom_pc_slot}
                    onChange={handleSlotChange}
                    height="280px"
                  />
                </Card>
              </div>

              {/* サイドバーエリア */}
              <div className="space-y-4">
                <Card className="border-2 border-dashed p-4">
                  <div className="mb-4 text-sm font-semibold text-muted-foreground">
                    サイドバー（PC）
                  </div>
                  <AdSlotZone
                    id="sidebar_pc_slot"
                    label="サイドバー広告"
                    description="300×600 (縦長)"
                    value={adSlots.sidebar_pc_slot}
                    onChange={handleSlotChange}
                    height="600px"
                  />
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* スマホ表示 */}
        <TabsContent value="mobile" className="mt-6">
          <div className="mx-auto max-w-md space-y-4">
            {/* 記事タイトル */}
            <Card className="border-2 border-dashed p-4">
              <div className="mb-2 text-sm font-semibold text-muted-foreground">
                記事ページ（スマホ）
              </div>
              <div className="rounded-lg bg-muted/30 p-6 text-center">
                <div className="text-xl font-bold text-foreground">記事タイトル</div>
                <div className="mt-2 text-xs text-muted-foreground">公開日 | カテゴリ</div>
              </div>
            </Card>

            {/* タイトル下広告 */}
            <Card className="border-2 border-dashed p-4">
              <AdSlotZone
                id="article_top_mobile_slot"
                label="タイトル下広告"
                description="300×250 (スクエア)"
                value={adSlots.article_top_mobile_slot}
                onChange={handleSlotChange}
                height="250px"
              />
            </Card>

            {/* 記事コンテンツ */}
            <Card className="border-2 border-dashed p-4">
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="mb-3 text-base font-bold text-foreground">## 見出し1</div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="h-2 bg-muted-foreground/20 rounded" />
                  <div className="h-2 bg-muted-foreground/20 rounded" />
                  <div className="h-2 bg-muted-foreground/20 rounded w-4/5" />
                </div>
              </div>

              {/* 記事内広告 1〜2 */}
              {[
                { position: 1, h2Position: 2 },
                { position: 2, h2Position: 4 },
              ].map(({ position, h2Position }) => (
                <AdSlotZone
                  key={`in_article_mobile_slot_${position}`}
                  id={`in_article_mobile_slot_${position}`}
                  label={`記事内広告 ${position}（${h2Position}つ目のH2前）`}
                  description="記事内広告（fluid）"
                  value={adSlots[`in_article_mobile_slot_${position}`]}
                  onChange={handleSlotChange}
                  height="280px"
                />
              ))}

              {/* 記事コンテンツ続き */}
              <div className="rounded-lg bg-muted/30 p-4 mt-6">
                <div className="mb-3 text-base font-bold text-foreground">## 見出し2</div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="h-2 bg-muted-foreground/20 rounded" />
                  <div className="h-2 bg-muted-foreground/20 rounded" />
                  <div className="h-2 bg-muted-foreground/20 rounded w-3/4" />
                </div>
              </div>

              {/* コンテンツ後広告 */}
              <div className="mt-6">
                <AdSlotZone
                  id="article_bottom_mobile_slot"
                  label="コンテンツ後広告"
                  description="記事内広告（fluid）"
                  value={adSlots.article_bottom_mobile_slot}
                  onChange={handleSlotChange}
                  height="280px"
                />
              </div>
            </Card>

            {/* サイドバー広告 */}
            <Card className="border-2 border-dashed p-4">
              <AdSlotZone
                id="sidebar_mobile_slot"
                label="サイドバー広告"
                description="300×250 (スクエア)"
                value={adSlots.sidebar_mobile_slot}
                onChange={handleSlotChange}
                height="250px"
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 保存ボタン */}
      <div className="flex justify-start">
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  );
}

// 広告スロットゾーンコンポーネント
interface AdSlotZoneProps {
  id: string;
  label: string;
  description: string;
  value: string;
  onChange: (id: string, value: string) => void;
  height?: string;
}

function AdSlotZone({
  id,
  label,
  description,
  value,
  onChange,
  height = "250px",
}: AdSlotZoneProps) {
  const [isEditing, setIsEditing] = useState(false);
  const isEmpty = !value;

  return (
    <div className="my-4">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
        {!isEmpty && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(id, "")}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isEditing || isEmpty ? (
        <div className="space-y-2">
          <Input
            placeholder="広告スロットID (例: 1234567890)"
            value={value}
            onChange={(e) => onChange(id, e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            AdSense管理画面からスロットIDをコピーして貼り付けてください
          </p>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
          style={{ minHeight: height }}
        >
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="rounded-lg bg-primary/10 p-3 mb-3 group-hover:bg-primary/20 transition-colors">
              <GripVertical className="h-6 w-6 text-primary" />
            </div>
            <div className="text-sm font-medium text-primary mb-1">
              広告スロット設定済み
            </div>
            <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
              {value}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              クリックして編集
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
