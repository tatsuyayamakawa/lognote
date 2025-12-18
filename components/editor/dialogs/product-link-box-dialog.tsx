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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image";

interface ProductLinkBoxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (data: {
    productName: string;
    productImage: string;
    amazonUrl?: string;
    amazonPrice?: string;
    rakutenUrl?: string;
    rakutenPrice?: string;
    yahooUrl?: string;
    yahooPrice?: string;
  }) => void;
  initialData?: {
    productName?: string;
    productImage?: string;
    amazonUrl?: string;
    amazonPrice?: string;
    rakutenUrl?: string;
    rakutenPrice?: string;
    yahooUrl?: string;
    yahooPrice?: string;
  };
  isEditMode?: boolean;
}

interface ProductSearchResult {
  productName: string;
  productImage: string;
  url: string;
  price: string;
}

export function ProductLinkBoxDialog({
  open,
  onOpenChange,
  onInsert,
  initialData,
  isEditMode = false,
}: ProductLinkBoxDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [amazonResults, setAmazonResults] = useState<ProductSearchResult[]>([]);
  const [rakutenResults, setRakutenResults] = useState<ProductSearchResult[]>(
    []
  );
  const [amazonError, setAmazonError] = useState<string>("");
  const [rakutenError, setRakutenError] = useState<string>("");

  const [selectedAmazon, setSelectedAmazon] =
    useState<ProductSearchResult | null>(null);
  const [selectedRakuten, setSelectedRakuten] =
    useState<ProductSearchResult | null>(null);

  // 手動入力用の状態（initialDataがあればそれを使用、なければ空文字）
  const [manualAmazonUrl, setManualAmazonUrl] = useState(initialData?.amazonUrl || "");
  const [manualRakutenUrl, setManualRakutenUrl] = useState(initialData?.rakutenUrl || "");
  const [yahooUrl, setYahooUrl] = useState(initialData?.yahooUrl || "");
  const [manualProductName, setManualProductName] = useState(initialData?.productName || "");
  const [manualProductImage, setManualProductImage] = useState(initialData?.productImage || "");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setAmazonError("");
    setRakutenError("");
    setAmazonResults([]);
    setRakutenResults([]);

    try {
      // Amazon検索
      const amazonRes = await fetch(
        `/api/affiliate/amazon/search?keyword=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (amazonRes.ok) {
        const data = await amazonRes.json();
        setAmazonResults(data.results || []);
      } else {
        const errorData = await amazonRes.json();
        setAmazonError(errorData.error || "Amazon APIエラーが発生しました");
        console.error("Amazon API Error:", errorData);
      }

      // 楽天検索
      const rakutenRes = await fetch(
        `/api/affiliate/rakuten/search?keyword=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (rakutenRes.ok) {
        const data = await rakutenRes.json();
        setRakutenResults(data.results || []);
      } else {
        const errorData = await rakutenRes.json();
        setRakutenError(errorData.error || "楽天APIエラーが発生しました");
        console.error("Rakuten API Error:", errorData);
      }
    } catch (error) {
      console.error("Search error:", error);
      setAmazonError("検索中にエラーが発生しました");
      setRakutenError("検索中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = () => {
    // API検索か手動入力のいずれかが必要（編集モードの場合は初期データがあればOK）
    if (!isEditMode && !selectedAmazon && !selectedRakuten && !manualAmazonUrl && !manualRakutenUrl && !yahooUrl) return;

    // 商品名と画像はAPI検索結果から取得、なければ手動入力、なければ初期データ、なければデフォルト値
    const productName =
      selectedAmazon?.productName || selectedRakuten?.productName || manualProductName || initialData?.productName || "商品";
    const productImage =
      selectedAmazon?.productImage || selectedRakuten?.productImage || manualProductImage || initialData?.productImage || "https://placehold.co/120x120/e5e7eb/6b7280?text=No+Image";

    onInsert({
      productName,
      productImage,
      amazonUrl: selectedAmazon?.url || manualAmazonUrl || undefined,
      amazonPrice: selectedAmazon?.price || (isEditMode ? initialData?.amazonPrice : undefined),
      rakutenUrl: selectedRakuten?.url || manualRakutenUrl || undefined,
      rakutenPrice: selectedRakuten?.price || (isEditMode ? initialData?.rakutenPrice : undefined),
      yahooUrl: yahooUrl || undefined,
    });

    // リセット
    setSearchQuery("");
    setAmazonResults([]);
    setRakutenResults([]);
    setSelectedAmazon(null);
    setSelectedRakuten(null);
    setManualAmazonUrl("");
    setManualRakutenUrl("");
    setYahooUrl("");
    setManualProductName("");
    setManualProductImage("");
    onOpenChange(false);
  };

  return (
    <Dialog
      key={initialData?.productName || 'new'}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "商品リンクボックスを編集" : "商品リンクボックスを挿入"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Amazon・楽天・Yahoo!のリンクを編集できます"
              : "商品を検索して、Amazon・楽天・Yahoo!のリンクを追加できます"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 検索バー */}
          <div className="flex gap-2">
            <Input
              placeholder="商品名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* 検索結果 */}
          <Tabs defaultValue={isEditMode ? "manual" : "amazon"} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="amazon">Amazon</TabsTrigger>
              <TabsTrigger value="rakuten">楽天</TabsTrigger>
              <TabsTrigger value="yahoo">Yahoo!</TabsTrigger>
              <TabsTrigger value="manual">手動編集</TabsTrigger>
            </TabsList>

            <TabsContent
              value="amazon"
              className="space-y-2 max-h-60 overflow-y-auto"
            >
              {amazonError ? (
                <div className="space-y-3">
                  <p className="text-sm text-red-500 text-center py-2">
                    {amazonError}
                  </p>
                  <div className="border-t pt-3">
                    <Label htmlFor="manual-amazon-url" className="text-sm">
                      Amazon URL（手動入力）
                    </Label>
                    <Input
                      id="manual-amazon-url"
                      placeholder="https://www.amazon.co.jp/..."
                      value={manualAmazonUrl}
                      onChange={(e) => setManualAmazonUrl(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      PA-APIが利用できない場合、手動でURLを入力できます
                    </p>
                  </div>
                </div>
              ) : amazonResults.length === 0 && searchQuery ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center py-2">
                    「{searchQuery}」の検索結果が見つかりませんでした
                  </p>
                  <div className="border-t pt-3">
                    <Label htmlFor="manual-amazon-url-not-found" className="text-sm">
                      または Amazon URL を手動入力
                    </Label>
                    <Input
                      id="manual-amazon-url-not-found"
                      placeholder="https://www.amazon.co.jp/..."
                      value={manualAmazonUrl}
                      onChange={(e) => setManualAmazonUrl(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : amazonResults.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center py-2">
                    商品を検索してください
                  </p>
                  <div className="border-t pt-3">
                    <Label htmlFor="manual-amazon-url-empty" className="text-sm">
                      または Amazon URL を手動入力
                    </Label>
                    <Input
                      id="manual-amazon-url-empty"
                      placeholder="https://www.amazon.co.jp/..."
                      value={manualAmazonUrl}
                      onChange={(e) => setManualAmazonUrl(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : (
                amazonResults.map((product, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 p-3 border rounded cursor-pointer hover:bg-accent max-w-2xl ${
                      selectedAmazon?.url === product.url
                        ? "bg-accent border-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedAmazon(product)}
                  >
                    <Image
                      src={product.productImage}
                      alt={product.productName}
                      width="64"
                      height="64"
                      className="w-16 h-16 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ¥{product.price}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent
              value="rakuten"
              className="space-y-2 max-h-60 overflow-y-auto"
            >
              {rakutenError ? (
                <div className="space-y-3">
                  <p className="text-sm text-red-500 text-center py-2">
                    {rakutenError}
                  </p>
                  <div className="border-t pt-3">
                    <Label htmlFor="manual-rakuten-url" className="text-sm">
                      楽天 URL（手動入力）
                    </Label>
                    <Input
                      id="manual-rakuten-url"
                      placeholder="https://item.rakuten.co.jp/..."
                      value={manualRakutenUrl}
                      onChange={(e) => setManualRakutenUrl(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : rakutenResults.length === 0 && searchQuery ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center py-2">
                    「{searchQuery}」の検索結果が見つかりませんでした
                  </p>
                  <div className="border-t pt-3">
                    <Label htmlFor="manual-rakuten-url-not-found" className="text-sm">
                      または 楽天 URL を手動入力
                    </Label>
                    <Input
                      id="manual-rakuten-url-not-found"
                      placeholder="https://item.rakuten.co.jp/..."
                      value={manualRakutenUrl}
                      onChange={(e) => setManualRakutenUrl(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : rakutenResults.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center py-2">
                    商品を検索してください
                  </p>
                  <div className="border-t pt-3">
                    <Label htmlFor="manual-rakuten-url-empty" className="text-sm">
                      または 楽天 URL を手動入力
                    </Label>
                    <Input
                      id="manual-rakuten-url-empty"
                      placeholder="https://item.rakuten.co.jp/..."
                      value={manualRakutenUrl}
                      onChange={(e) => setManualRakutenUrl(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : (
                rakutenResults.map((product, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 p-3 border rounded cursor-pointer hover:bg-accent max-w-2xl ${
                      selectedRakuten?.url === product.url
                        ? "bg-accent border-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedRakuten(product)}
                  >
                    <Image
                      src={product.productImage}
                      alt={product.productName}
                      width="64"
                      height="64"
                      className="w-16 h-16 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.productName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ¥{product.price}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="yahoo" className="space-y-2">
              <Label htmlFor="yahoo-url">Yahoo!ショッピング URL（任意）</Label>
              <Input
                id="yahoo-url"
                placeholder="https://..."
                value={yahooUrl}
                onChange={(e) => setYahooUrl(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manual-product-name">商品名</Label>
                <Input
                  id="manual-product-name"
                  placeholder="商品名を入力..."
                  value={manualProductName}
                  onChange={(e) => setManualProductName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-product-image">商品画像URL</Label>
                <Input
                  id="manual-product-image"
                  placeholder="https://..."
                  value={manualProductImage}
                  onChange={(e) => setManualProductImage(e.target.value)}
                />
                {manualProductImage && (
                  <div className="mt-2 border rounded p-2">
                    <p className="text-xs text-muted-foreground mb-2">プレビュー:</p>
                    <Image
                      src={manualProductImage}
                      alt="商品画像プレビュー"
                      width={120}
                      height={120}
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-amazon-url-tab">Amazon URL</Label>
                <Input
                  id="manual-amazon-url-tab"
                  placeholder="https://www.amazon.co.jp/..."
                  value={manualAmazonUrl}
                  onChange={(e) => setManualAmazonUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-rakuten-url-tab">楽天 URL</Label>
                <Input
                  id="manual-rakuten-url-tab"
                  placeholder="https://item.rakuten.co.jp/..."
                  value={manualRakutenUrl}
                  onChange={(e) => setManualRakutenUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-yahoo-url-tab">Yahoo! URL</Label>
                <Input
                  id="manual-yahoo-url-tab"
                  placeholder="https://..."
                  value={yahooUrl}
                  onChange={(e) => setYahooUrl(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* 選択された商品のプレビュー */}
          {(selectedAmazon || selectedRakuten || manualAmazonUrl || manualRakutenUrl || yahooUrl) && (
            <div className="border rounded p-3 bg-muted/50">
              <p className="text-sm font-medium mb-2">選択された商品:</p>
              <div className="flex gap-2 flex-wrap">
                {(selectedAmazon || manualAmazonUrl) && (
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
                    Amazon
                  </span>
                )}
                {(selectedRakuten || manualRakutenUrl) && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                    楽天
                  </span>
                )}
                {yahooUrl && (
                  <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">
                    Yahoo!
                  </span>
                )}
              </div>
              <p className="text-sm mt-2">
                {selectedAmazon?.productName || selectedRakuten?.productName || "手動入力URL"}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleInsert}
            disabled={!selectedAmazon && !selectedRakuten && !manualAmazonUrl && !manualRakutenUrl && !yahooUrl}
          >
            {isEditMode ? "更新" : "挿入"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
