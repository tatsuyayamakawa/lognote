"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ページ遷移時に常にスクロール位置をトップに戻すコンポーネント
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
