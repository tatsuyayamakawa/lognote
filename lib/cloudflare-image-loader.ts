/**
 * Cloudflare Images カスタムローダー
 *
 * Next.js の Image コンポーネントで Cloudflare Images を使用するためのローダー
 * 外部画像（DMM API など）も最適化可能
 *
 * このローダーは Cloudflare Images Resizing API を使用します
 * https://developers.cloudflare.com/images/url-format
 */

export interface CloudflareImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudflareImageLoader({
  src,
  width,
  quality = 75,
}: CloudflareImageLoaderProps): string {
  // Cloudflare Account Hash（環境変数から取得）
  const accountHash = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH;

  // 環境変数が設定されていない場合は開発環境として元の画像を返す
  if (!accountHash) {
    console.warn(
      "⚠️ NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH が設定されていません。元の画像URLを使用します。"
    );
    return src;
  }

  // 絶対URLかどうかを判定
  const isAbsoluteUrl = src.startsWith("http://") || src.startsWith("https://");

  // 画像のソースURLを決定
  let imageUrl: string;
  if (isAbsoluteUrl) {
    imageUrl = src;
  } else {
    // 相対パスの場合は絶対URLに変換
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://bodycare-yumin.com";
    imageUrl = new URL(src, baseUrl).toString();
  }

  // Cloudflare Images Resizing API を使用
  // フォーマット: https://<zone>/cdn-cgi/image/<options>/<source-image>
  // または: https://imagedelivery.net/<account-hash>/<image-id>/<variant-name>

  // オプション: w=width,q=quality,f=auto,fit=scale-down
  const options = [
    `w=${width}`, // 幅を指定（レスポンシブ対応）
    `q=${quality}`, // 品質を指定 (1-100)
    `f=auto`, // WebP/AVIF 自動変換
    `fit=scale-down`, // 元の画像より大きくしない
  ].join(",");

  // Cloudflare Worker/Zone が必要な cdn-cgi/image は使えないので
  // 代わりに Cloudflare Images のプロキシ機能を使用
  // 注: これには Cloudflare Images の有料プランが必要です

  return `https://imagedelivery.net/${accountHash}/${encodeURIComponent(
    imageUrl
  )}?${options}`;
}
