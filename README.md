# 整えて、創る。

技術ブログ＆ライフスタイルメディア。

## 概要

Next.js 16のApp Routerを使用したモダンなCMS。

## 技術スタック

### Core
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

### Backend
- **Supabase** (認証、DB、ストレージ)

### UI/Editor
- **Tiptap** (リッチテキストエディタ)
- **Radix UI**
- **Lucide React**
- **Framer Motion**

### Analytics
- **Google Analytics Data API**
- **Google Search Console API**
- **Google AdSense Management API** (OAuth 2.0)

## 主な機能

- 📝 記事管理（Tiptapエディタ）
- 📊 統合ダッシュボード（GA4、Search Console、AdSense）
- 🏷️ カテゴリー管理
- 🖼️ メディアライブラリ
- 🔍 検索機能
- 📱 レスポンシブデザイン
- 🌓 ダークモード

## セットアップ

```bash
npm install
cp .env.example .env.local
# .env.localを編集
npm run dev
```

## ドキュメント

### セットアップ
- [Supabase基本設定](docs/setup/01-supabase-setup.md)
- [Supabaseストレージ設定](docs/setup/02-supabase-storage-setup.md)
- [Supabaseセキュリティ設定](docs/setup/03-supabase-security-setup.md)

### アナリティクス
- [Google Tag Manager設定](docs/analytics/01-google-tag-manager-setup.md)
- [Google Analytics設定](docs/analytics/02-google-analytics-setup.md)
- [Analytics Dashboard設定](docs/analytics/03-analytics-dashboard-setup.md)

### 収益化
- [AdSense設定ガイド](docs/monetization/01-adsense-setup.md)
- [広告レイアウトエディタ](docs/monetization/04-ad-layout-editor.md)
- [アフィリエイト設定](docs/monetization/05-affiliate-setup.md)

### トラブルシューティング
- [Supabase](docs/troubleshooting/supabase.md)
- [Analytics](docs/troubleshooting/analytics.md)
- [AdSense](docs/troubleshooting/adsense.md)

### 機能開発
- [ブログ要件定義](docs/features/01-blog-requirements.md)
- [OG画像最適化](docs/features/02-og-image-optimization.md)
- [Updated At トリガー修正](docs/features/03-fix-updated-at-trigger.md)
