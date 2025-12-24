# Google Analytics Data API 統合ガイド

このドキュメントでは、管理ダッシュボードでGoogle Analytics 4のデータを表示するための設定方法を説明します。

**注意**: この設定は、Google Tag Manager（ページトラッキング用）とは別のものです。GTMの設定については [Google Tag Manager設定](01-google-tag-manager-setup.md) を参照してください。

## 前提条件

- Google Analytics 4 プロパティが設定されていること（[Google Analytics設定](02-google-analytics-setup.md) 参照）
- Google Cloud Platform (GCP) プロジェクトへのアクセス権限

## 認証方式について

このプロジェクトでは **サービスアカウント認証** を使用します。

- **AdSense Management API**: OAuth 2.0 認証を使用
- **Google Analytics Data API**: サービスアカウント認証を使用（本ドキュメント）

サービスアカウント認証は、サーバーサイドで自動的にデータを取得するのに適しています。

## セットアップ手順

### 1. Google Analytics Data API を有効化

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを選択（GTM/GA4設定で使用したものと同じ）
3. 「APIとサービス」→「ライブラリ」に移動
4. 「Google Analytics Data API」を検索
5. 「有効にする」をクリック

### 2. サービスアカウントを作成

1. Google Cloud Console で「IAMと管理」→「サービスアカウント」に移動
2. 「サービスアカウントを作成」をクリック
3. サービスアカウント名を入力（例: `lognote-analytics-reader`）
4. 「作成して続行」をクリック
5. ロールは不要なので、「続行」→「完了」をクリック

### 3. サービスアカウントキーを生成

1. 作成したサービスアカウントをクリック
2. 「キー」タブに移動
3. 「鍵を追加」→「新しい鍵を作成」をクリック
4. キーのタイプで「JSON」を選択
5. 「作成」をクリックしてJSONファイルをダウンロード
6. ダウンロードしたJSONファイルをプロジェクトルートに配置（例: `ga4-analytics-key.json`）

**重要**: このJSONファイルには機密情報が含まれるため、`.gitignore` に追加してGitにコミットしないようにしてください。

### 4. Google Analytics にサービスアカウントを追加

1. [Google Analytics](https://analytics.google.com/)にアクセス
2. 管理画面に移動
3. 「プロパティ」→「プロパティのアクセス管理」を選択
4. 右上の「+」→「ユーザーを追加」をクリック
5. サービスアカウントのメールアドレスを入力
   （例: `lognote-analytics-reader@project-id.iam.gserviceaccount.com`）
6. 役割で「閲覧者」を選択
7. 「追加」をクリック

### 5. GA4 プロパティIDを確認

1. Google Analytics の管理画面に移動
2. 「プロパティ」→「プロパティの設定」を選択
3. プロパティIDをコピー（数字のみ、例: `264233355`）

### 6. 環境変数を設定

#### ローカル開発環境

`.env.local` ファイルに以下を追加：

```env
# Google Analytics 4 Data API
GA4_PROPERTY_ID=264233355
GOOGLE_APPLICATION_CREDENTIALS=ga4-analytics-key.json
```

**重要**:
- `GA4_PROPERTY_ID`: 数字のみのプロパティID
- `GOOGLE_APPLICATION_CREDENTIALS`: JSONファイルのパス（プロジェクトルートからの相対パスまたは絶対パス）

#### 本番環境（Vercel等）

本番環境では、ファイルシステムが読み取り専用のため、JSON文字列として環境変数に設定します。

Vercelの環境変数に以下を設定：

**GA4_PROPERTY_ID**
```
264233355
```

**GOOGLE_SERVICE_ACCOUNT_JSON**
```json
{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...@....iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

> **注意**: `ga4-analytics-key.json` ファイルの内容を1行にして、そのまま環境変数の値として設定してください。改行は `\n` のままで問題ありません。

### 6. 開発サーバーを再起動

環境変数を読み込むため、開発サーバーを再起動してください：

```bash
# サーバーを停止 (Ctrl+C)
# 再起動
npm run dev
# または
bun dev
```

## 表示されるデータ

ダッシュボードでは以下のアナリティクスデータが表示されます：

### 1. ページビュー推移
- 過去30日間の日別ページビュー数をエリアチャートで表示

### 2. オーガニック検索統計
- Google検索からの流入（オーガニックトラフィック）の推移
- セッション数とエンゲージメントセッション数を表示

### 3. 人気ページ
- 最も閲覧されている上位10ページ
- ページタイトル、パス、閲覧数を表示

### 4. 検索トラフィック
- Google検索からの流入元
- リファラー、セッション数、エンゲージメント数を表示

## セキュリティに関する注意

- サービスアカウントのJSONキーファイルは **絶対にGitにコミットしないでください**
- `.gitignore` に JSON キーファイルのパスが含まれていることを確認
- 本番環境では、環境変数を安全な方法で管理（Vercel環境変数、AWS Secrets Manager等）

---

## トラブルシューティング

問題が発生した場合は、[Analytics トラブルシューティング](../troubleshooting/analytics.md) を参照してください。

## 参考リンク

- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [サービスアカウントの作成と管理](https://cloud.google.com/iam/docs/service-accounts)
- [Google Analytics API の認証](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries)
