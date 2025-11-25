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
- 📈 アナリティクスダッシュボード
  - Google Analytics 4連携
  - Google Search Console連携
  - ページビュー推移グラフ
  - オーガニック検索統計
  - 人気ページランキング
  - 流入キーワード分析
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
- **Google Search Console API** - 検索キーワード分析
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
cp .env.example .env.local
# .env.localファイルを編集して必要な環境変数を設定

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 環境変数

`.env.local`ファイルに以下の環境変数を設定してください：

```bash
# Supabase設定（必須）
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Tag Manager（任意）
NEXT_PUBLIC_GTM_ID=your-gtm-id

# Google Analytics 4設定（任意 - ダッシュボード機能用）
GA4_PROPERTY_ID=your-ga4-property-id
GOOGLE_APPLICATION_CREDENTIALS=path-to-service-account-json
```

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

## Google Analytics / Search Console連携設定

管理ダッシュボードでアナリティクスデータを表示するには、Google Analytics 4とGoogle Search Consoleの設定が必要です。

### 1. Google Cloud プロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（例: `lognote-analytics`）

### 2. APIの有効化

以下のAPIを有効にします：

1. **Google Analytics Data API**
   - [APIライブラリ](https://console.cloud.google.com/apis/library)で「Google Analytics Data API」を検索
   - 「有効にする」をクリック

2. **Google Search Console API**
   - 同様に「Google Search Console API」を検索して有効化

### 3. サービスアカウントの作成

1. [IAMと管理 > サービスアカウント](https://console.cloud.google.com/iam-admin/serviceaccounts)に移動
2. 「サービスアカウントを作成」をクリック
3. サービスアカウント名を入力（例: `analytics-reader`）
4. 「作成して続行」をクリック
5. ロールは設定せずに「続行」→「完了」

### 4. 認証キーの生成

1. 作成したサービスアカウントをクリック
2. 「キー」タブに移動
3. 「鍵を追加」→「新しい鍵を作成」
4. JSON形式を選択してダウンロード
5. ダウンロードしたJSONファイルをプロジェクトルートに配置（例: `ga4-analytics-key.json`）

### 5. Google Analytics 4の設定

1. [Google Analytics](https://analytics.google.com/)にログイン
2. 管理 > プロパティアクセス管理に移動
3. 「+」ボタンから「ユーザーを追加」
4. サービスアカウントのメールアドレスを追加（例: `analytics-reader@lognote-analytics.iam.gserviceaccount.com`）
5. 役割を「閲覧者」に設定して保存

**GA4 Property IDの確認方法：**
- 管理 > プロパティ設定で「プロパティID」を確認（例: `264233355`）

### 6. Google Search Consoleの設定

1. [Google Search Console](https://search.google.com/search-console)にアクセス
2. 対象のプロパティを選択
3. 設定 > ユーザーと権限に移動
4. 「ユーザーを追加」をクリック
5. サービスアカウントのメールアドレスを追加
6. 権限を「オーナー」または「フル」に設定して保存

### 7. 環境変数の設定

#### ローカル開発環境

`.env.local`に以下を追加：

```bash
# Google Analytics 4
GA4_PROPERTY_ID=264233355  # 自分のProperty IDに置き換え
GOOGLE_APPLICATION_CREDENTIALS=ga4-analytics-key.json  # JSONファイルのパス
```

#### Vercel本番環境

Vercelではファイルシステムが読み取り専用のため、JSONファイルの内容を環境変数として設定する必要があります。

1. Vercelプロジェクトの設定 > Environment Variablesに移動
2. 以下の環境変数を追加：

**GA4_PROPERTY_ID**
```
264233355
```

**GOOGLE_SERVICE_ACCOUNT_JSON**
```json
{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@....iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

> **注意**: `ga4-analytics-key.json`ファイルの内容を1行にして、そのまま環境変数の値として設定してください。改行は`\n`のままで問題ありません。

### トラブルシューティング

**ダッシュボードにデータが表示されない場合：**

1. ブラウザのコンソールログを確認
2. 以下の点をチェック：
   - サービスアカウントがGA4プロパティに追加されているか
   - サービスアカウントがSearch Consoleに追加されているか
   - JSON認証ファイルのパスが正しいか
   - GA4 Property IDが正しいか
   - APIが有効化されているか

3. 開発サーバーを再起動してください：
   ```bash
   # サーバーを停止（Ctrl+C）
   npm run dev
   ```

4. それでも解決しない場合は、このREADMEの設定手順を最初から確認してください

## ライセンス

Private

## 開発者

Tatsuya Yamakawa
