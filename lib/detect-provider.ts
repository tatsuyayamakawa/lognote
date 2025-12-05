/**
 * HTMLコードからプロバイダーを自動判定
 */
export function detectProvider(code: string): {
  provider: "amazon" | "rakuten" | "a8" | "moshimo" | "adsense" | "custom";
  name: string;
  color: string;
  textColor: string;
} {
  const lowerCode = code.toLowerCase();

  // Amazon
  if (
    lowerCode.includes("amazon.co.jp") ||
    lowerCode.includes("amzn.to") ||
    lowerCode.includes("amazon-adsystem")
  ) {
    return {
      provider: "amazon",
      name: "Amazon",
      color: "bg-[#FF9900]",
      textColor: "text-white",
    };
  }

  // 楽天
  if (
    lowerCode.includes("rakuten.co.jp") ||
    lowerCode.includes("hb.afl.rakuten") ||
    lowerCode.includes("room.rakuten")
  ) {
    return {
      provider: "rakuten",
      name: "楽天市場",
      color: "bg-[#BF0000]",
      textColor: "text-white",
    };
  }

  // A8.net
  if (
    lowerCode.includes("a8.net") ||
    lowerCode.includes("atclk.com") ||
    lowerCode.includes("ck.jp.ap.valuecommerce")
  ) {
    return {
      provider: "a8",
      name: "A8.net",
      color: "bg-[#0066CC]",
      textColor: "text-white",
    };
  }

  // もしもアフィリエイト
  if (
    lowerCode.includes("moshimo-affiliate") ||
    lowerCode.includes("af.moshimo.com")
  ) {
    return {
      provider: "moshimo",
      name: "もしもアフィリエイト",
      color: "bg-[#00A0E9]",
      textColor: "text-white",
    };
  }

  // Google AdSense
  if (
    lowerCode.includes("adsbygoogle") ||
    lowerCode.includes("googlesyndication.com") ||
    lowerCode.includes("data-ad-client")
  ) {
    return {
      provider: "adsense",
      name: "Google AdSense",
      color: "bg-[#4285F4]",
      textColor: "text-white",
    };
  }

  // カスタム（判定できない場合）
  return {
    provider: "custom",
    name: "カスタムコード",
    color: "bg-gray-600",
    textColor: "text-white",
  };
}
