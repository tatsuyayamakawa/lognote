# 整えて、創る。

身体を整え、思考を整え、コードを書く。技術ブログ＆ライフスタイルメディア。

## 概要

Next.js 16 + Supabase + TypeScriptで構築された、モダンなブログプラットフォームです。

## 主な機能

### フロントエンド
- 📝 記事一覧・詳細表示
- 🏷️ カテゴリー別記事表示
- 🔍 記事検索機能
- 📱 レスポンシブデザイン
- 🌓 ダークモード対応
- 🔗 外部リンクアイコン表示
- ⭐ 特集記事機能
- 📊 関連記事表示

### 管理画面
- ✍️ リッチテキストエディタ（Tiptap）
  - 見出し（H2、H3）装飾
  - 文字色変更（赤、青）
  - 装飾解除機能
  - 太字、斜体、リスト、引用、コードブロック
  - リンク、画像挿入
- 📂 カテゴリー管理
- 🖼️ メディアライブラリ（最大10MB）
- 📈 Google Analyticsダッシュボード
- 👁️ 閲覧数トラッキング

## 技術スタック

### フレームワーク・ライブラリ
- **Next.js 16** - App Router
- **React 19** - UIライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **Supabase** - バックエンド（認証、データベース、ストレージ）

### エディタ・UI
- **Tiptap** - リッチテキストエディタ
- **Radix UI** - アクセシブルなUIコンポーネント
- **Lucide React** - アイコン
- **Framer Motion** - アニメーション

### その他
- **Google Analytics Data API** - アクセス解析
- **date-fns** - 日付処理
- **lowlight** - シンタックスハイライト

## セットアップ

### 必要な環境
- Node.js 20以上
- npm または yarn

### インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd lognote

# 依存関係のインストール
npm install

# 環境変数の設定
# .env.localファイルを作成し、以下の変数を設定
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
# GOOGLE_ANALYTICS_PROPERTY_ID=your-ga-property-id
# GOOGLE_APPLICATION_CREDENTIALS=path-to-service-account-json

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
npm run build
npm run start
```

## プロジェクト構成

```
lognote/
├── app/                    # Next.js App Router
│   ├── (public)/          # 公開ページ
│   ├── admin/             # 管理画面
│   ├── api/               # APIルート
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── editor/           # エディタコンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   ├── ui/               # UIコンポーネント
│   └── ...
├── lib/                   # ユーティリティ関数
│   ├── supabase/         # Supabase設定
│   └── utils.ts          # 汎用ユーティリティ
└── types/                 # TypeScript型定義
```

## データベース設計

Supabaseを使用したPostgreSQLデータベース：

- **posts** - 記事データ
- **categories** - カテゴリーデータ
- **post_categories** - 記事とカテゴリーの中間テーブル
- **page_views** - ページビュー統計

## ライセンス

Private

## 開発者

Tatsuya Yumin
