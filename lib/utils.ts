import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * URLを環境に応じて自動分岐させる
 * 優先順位: NEXT_PUBLIC_SITE_URL > VERCEL_PROJECT_PRODUCTION_URL > localhost
 */
export const getBaseURL = () => {
  // カスタムドメインを使用する場合は環境変数で明示的に指定
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Vercelのデフォルトドメイン
  const url = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  return url
    ? `https://${url}`
    : `http://localhost:${process.env.PORT || 3000}`;
};

/**
 * 日付をフォーマットする（日本語形式）
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * 相対的な日付を取得（例: 3日前）
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    年: 31536000,
    ヶ月: 2592000,
    週間: 604800,
    日: 86400,
    時間: 3600,
    分: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval}${unit}前`;
    }
  }

  return "たった今";
}
