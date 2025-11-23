# Google Analytics 4 統合ガイド

このドキュメントでは、ダッシュボードでGoogle Analytics 4のデータを表示するための設定方法を説明します。

## 前提条件

- Google Analytics 4 プロパティが設定されていること
- Google Cloud Platform (GCP) プロジェクトへのアクセス権限

## セットアップ手順

### 1. Google Cloud でサービスアカウントを作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを選択または新規作成
3. 「IAMと管理」→「サービスアカウント」に移動
4. 「サービスアカウントを作成」をクリック
5. サービスアカウント名を入力（例: `blog-analytics-reader`）
6. 「作成して続行」をクリック
7. ロールは不要なので、「完了」をクリック

### 2. サービスアカウントキーを生成

1. 作成したサービスアカウントをクリック
2. 「キー」タブに移動
3. 「鍵を追加」→「新しい鍵を作成」をクリック
4. キーのタイプで「JSON」を選択
5. 「作成」をクリックしてJSONファイルをダウンロード
6. ダウンロードしたJSONファイルを安全な場所に保存

### 3. Google Analytics にサービスアカウントを追加

1. [Google Analytics](https://analytics.google.com/)にアクセス
2. 管理画面に移動
3. 「プロパティ」→「プロパティのアクセス管理」を選択
4. 右上の「+」→「ユーザーを追加」をクリック
5. サービスアカウントのメールアドレスを入力（例: `blog-analytics-reader@project-id.iam.gserviceaccount.com`）
6. 役割で「閲覧者」を選択
7. 「追加」をクリック

### 4. GA4 プロパティIDを確認

1. Google Analytics の管理画面に移動
2. 「プロパティ」→「プロパティの設定」を選択
3. プロパティIDをコピー（例: `123456789`）

### 5. 環境変数を設定

プロジェクトのルートディレクトリにある `.env.local` ファイルに以下を追加：

```env
# Google Analytics 4
GA4_PROPERTY_ID=your-property-id-here
GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-service-account-key.json
```

**重要**:
- `GA4_PROPERTY_ID`: 数字のみのプロパティID（例: `123456789`）
- `GOOGLE_APPLICATION_CREDENTIALS`: ダウンロードしたJSONファイルの絶対パス

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

## トラブルシューティング

### データが表示されない

1. 環境変数が正しく設定されているか確認
2. サービスアカウントがGA4プロパティに追加されているか確認
3. GA4プロパティIDが正しいか確認
4. JSONキーファイルのパスが正しいか確認
5. 開発サーバーを再起動したか確認

### 認証エラーが発生する

- サービスアカウントのJSONキーファイルが正しい場所にあるか確認
- ファイルのパーミッションを確認（読み取り可能である必要があります）
- JSONファイルが破損していないか確認

### 「データがありません」と表示される

- GA4プロパティにデータが存在するか確認
- サービスアカウントに「閲覧者」権限が付与されているか確認
- 過去30日間にトラフィックがあるか確認

## セキュリティに関する注意

- サービスアカウントのJSONキーファイルは **絶対にGitにコミットしないでください**
- `.gitignore` に JSON キーファイルのパスが含まれていることを確認
- 本番環境では、環境変数を安全な方法で管理（Vercel環境変数、AWS Secrets Manager等）

## 参考リンク

- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [サービスアカウントの作成と管理](https://cloud.google.com/iam/docs/service-accounts)
- [Google Analytics API の認証](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries)
