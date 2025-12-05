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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface AffiliateBoxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (data: {
    provider?: "amazon" | "rakuten" | "a8" | "moshimo" | "adsense" | "custom";
    code: string;
    productName?: string;
    productImage?: string;
    productPrice?: string;
    productUrl?: string;
  }) => void;
}

export function AffiliateBoxDialog({
  open,
  onOpenChange,
  onInsert,
}: AffiliateBoxDialogProps) {
  const [provider, setProvider] = useState<"amazon" | "rakuten" | "a8" | "moshimo">("amazon");
  const [code, setCode] = useState("");
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [insertMode, setInsertMode] = useState<"simple" | "detailed">("simple");

  const handleInsert = () => {
    if (!code.trim()) {
      alert("アフィリエイトコードを入力してください");
      return;
    }

    onInsert({
      provider,
      code: code.trim(),
      productName: insertMode === "detailed" ? productName : undefined,
      productImage: insertMode === "detailed" ? productImage : undefined,
      productPrice: insertMode === "detailed" ? productPrice : undefined,
      productUrl: insertMode === "detailed" ? productUrl : undefined,
    });

    // リセット
    setCode("");
    setProductName("");
    setProductImage("");
    setProductPrice("");
    setProductUrl("");
    setInsertMode("simple");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>アフィリエイトリンクを挿入</DialogTitle>
          <DialogDescription>
            Amazon、楽天、A8.net、もしもアフィリエイトのコードを埋め込めます
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* プロバイダー選択 */}
          <div className="space-y-2">
            <Label htmlFor="provider">アフィリエイトプロバイダー</Label>
            <Select
              value={provider}
              onValueChange={(value) =>
                setProvider(value as "amazon" | "rakuten" | "a8" | "moshimo")
              }
            >
              <SelectTrigger id="provider">
                <SelectValue placeholder="プロバイダーを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amazon">Amazon</SelectItem>
                <SelectItem value="rakuten">楽天市場</SelectItem>
                <SelectItem value="a8">A8.net</SelectItem>
                <SelectItem value="moshimo">もしもアフィリエイト</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 挿入モード切り替え */}
          <Tabs value={insertMode} onValueChange={(v) => setInsertMode(v as "simple" | "detailed")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">シンプル挿入</TabsTrigger>
              <TabsTrigger value="detailed">詳細情報付き</TabsTrigger>
            </TabsList>

            <TabsContent value="simple" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="code-simple">アフィリエイトコード *</Label>
                <Textarea
                  id="code-simple"
                  placeholder="アフィリエイトプロバイダーから取得したHTMLコードをここに貼り付けてください"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={8}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  例: &lt;iframe&gt;...&lt;/iframe&gt; または &lt;a href=&quot;...&quot;&gt;...&lt;/a&gt;
                </p>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="code-detailed">アフィリエイトコード *</Label>
                <Textarea
                  id="code-detailed"
                  placeholder="アフィリエイトプロバイダーから取得したHTMLコードをここに貼り付けてください"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="productName">商品名</Label>
                  <Input
                    id="productName"
                    placeholder="例: Anker PowerCore 10000"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="productImage">商品画像URL</Label>
                  <Input
                    id="productImage"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productPrice">価格</Label>
                  <Input
                    id="productPrice"
                    placeholder="¥3,990"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productUrl">商品ページURL</Label>
                  <Input
                    id="productUrl"
                    type="url"
                    placeholder="https://www.amazon.co.jp/..."
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-muted p-3 rounded-md text-xs text-muted-foreground">
                💡 詳細情報を入力すると、エディタ上でプレビューが表示されます。
                公開時には実際のアフィリエイトコードが表示されます。
              </div>
            </TabsContent>
          </Tabs>

          {/* 使い方のヒント */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 space-y-2">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
              📌 使い方のヒント
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>各プロバイダーの管理画面からアフィリエイトコードをコピーしてください</li>
              <li>HTMLタグ（&lt;iframe&gt;、&lt;a&gt;、&lt;script&gt;など）がそのまま使えます</li>
              <li>詳細情報を入力すると、読者に見やすいレイアウトで表示されます</li>
              <li>エディタでは編集用のプレビュー、公開ページでは実際のコードが表示されます</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleInsert}>挿入</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
