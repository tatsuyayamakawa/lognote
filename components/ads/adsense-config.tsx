"use client";

import { useEffect, useRef } from "react";

export function AdSenseConfig() {
  const initialized = useRef(false);

  useEffect(() => {
    // 既に初期化済みならスキップ（React Strict Mode 対策）
    if (initialized.current) {
      return;
    }

    // AdSense の自動広告設定（クライアントサイドで実行）
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-7839828582645189",
        enable_page_level_ads: true,
        overlays: { bottom: false }, // 下部オーバーレイ無効
        anchor_top: false, // 上部アンカー無効
        anchor_bottom: false, // 下部アンカー無効
      });

      initialized.current = true;
    } catch (err) {
      console.error("AdSense config error:", err);
    }
  }, []);

  return null;
}
