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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface AffiliateBoxDialogSimpleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (data: {
    code: string;
    productName?: string;
    productImage?: string;
    productPrice?: string;
    productUrl?: string;
  }) => void;
}

export function AffiliateBoxDialogSimple({
  open,
  onOpenChange,
  onInsert,
}: AffiliateBoxDialogSimpleProps) {
  const [code, setCode] = useState("");
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [insertMode, setInsertMode] = useState<"simple" | "detailed">("simple");

  const handleInsert = () => {
    if (!code.trim()) {
      alert("埋め込みコードを入力してください");
      return;
    }

    onInsert({
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
          <DialogTitle>コード埋め込み</DialogTitle>
          <DialogDescription>
            アフィリエイトコード、AdSense広告コードなど、任意のHTMLコードを記事内に埋め込めます
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 挿入モード切り替え */}
          <Tabs value={insertMode} onValueChange={(v) => setInsertMode(v as "simple" | "detailed")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">シンプル</TabsTrigger>
              <TabsTrigger value="detailed">詳細情報付き</TabsTrigger>
            </TabsList>

            <TabsContent value="simple" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="code-simple">埋め込みコード *</Label>
                <Textarea
                  id="code-simple"
                  placeholder="HTMLコード（iframe、script、aタグなど）をここに貼り付けてください"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={10}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  例: アフィリエイトコード、AdSenseコード、YouTubeの埋め込みなど
                </p>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="code-detailed">埋め込みコード *</Label>
                <Textarea
                  id="code-detailed"
                  placeholder="HTMLコードをここに貼り付けてください"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="productName">タイトル（任意）</Label>
                  <Input
                    id="productName"
                    placeholder="例: おすすめ商品"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="productImage">画像URL（任意）</Label>
                  <Input
                    id="productImage"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productPrice">価格（任意）</Label>
                  <Input
                    id="productPrice"
                    placeholder="¥3,990"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productUrl">リンクURL（任意）</Label>
                  <Input
                    id="productUrl"
                    type="url"
                    placeholder="https://..."
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-muted p-3 rounded-md text-xs text-muted-foreground">
                💡 詳細情報を入力すると、エディタ上で見やすいプレビューが表示されます。
                公開時には実際の埋め込みコードが表示されます。
              </div>
            </TabsContent>
          </Tabs>

          {/* 使い方のヒント */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 space-y-2">
            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
              📌 使える埋め込みコード例
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li><strong>アフィリエイト:</strong> Amazon、楽天、A8.net、もしもアフィリエイト</li>
              <li><strong>広告:</strong> Google AdSense、各種ディスプレイ広告</li>
              <li><strong>埋め込み:</strong> YouTube、Twitter、Instagram</li>
              <li><strong>その他:</strong> iframeやscriptタグを含むHTML</li>
            </ul>
          </div>

          {/* AdSenseの例 */}
          <details className="text-xs">
            <summary className="cursor-pointer font-medium mb-2">AdSenseコードの例を見る</summary>
            <div className="bg-muted p-3 rounded-md">
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all">
{`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`}
              </pre>
            </div>
          </details>
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
