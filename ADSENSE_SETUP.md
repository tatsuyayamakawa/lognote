# Google AdSense Management API 設定ガイド（OAuth 2.0版）

このガイドでは、LogNoteのダッシュボードでAdSense収益データを表示するための設定方法を説明します。

**注意**: この実装では、サービスアカウントではなく**OAuth 2.0認証**を使用します。これにより、個人のAdSenseアカウントでも簡単に連携できます。

## 前提条件

- Google AdSenseアカウントを持っていること
- Google Cloud Platformのプロジェクトがあること
- Supabaseプロジェクトが設定されていること

## 設定手順

### 1. Google Cloud ConsoleでOAuth 2.0クライアントIDを作成

#### 1-1. AdSense Management APIの有効化

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 使用するプロジェクトを選択
3. 「APIとサービス」→「ライブラリ」に移動
4. 「AdSense Management API」を検索
5. 「有効にする」をクリック

#### 1-2. OAuth 2.0クライアントIDの作成

1. Google Cloud Consoleで「APIとサービス」→「認証情報」に移動
2. 「+ 認証情報を作成」→「OAuth クライアント ID」をクリック

3. **OAuth同意画面の設定**（初回のみ）
   - 「OAuth同意画面を構成」をクリック
   - User Type: 「外部」を選択して「作成」
   - アプリ名: 「LogNote AdSense Integration」（任意）
   - ユーザーサポートメール: あなたのメールアドレス
   - デベロッパーの連絡先情報: あなたのメールアドレス
   - 「保存して次へ」をクリック
   - スコープ: そのまま「保存して次へ」
   - テストユーザー: 「+ADD USERS」をクリックして、AdSenseアカウントのメールアドレスを追加
   - 「保存して次へ」→「ダッシュボードに戻る」

4. **OAuth クライアント IDの作成**
   - 再度「+ 認証情報を作成」→「OAuth クライアント ID」をクリック
   - アプリケーションの種類: 「ウェブ アプリケーション」
   - 名前: 「LogNote AdSense Client」（任意）
   - 承認済みのリダイレクトURI:
     - ローカル開発: `http://localhost:3000/api/auth/adsense/callback`
     - 本番環境: `https://your-domain.com/api/auth/adsense/callback`
   - 「作成」をクリック
   - **クライアントIDとクライアントシークレット**が表示されるので、コピーして保存

### 2. Supabaseでデータベースマイグレーションを実行

1. プロジェクトルートで以下のコマンドを実行:

```bash
# Supabaseにログイン（初回のみ）
npx supabase login

# ローカルのマイグレーションをリモートにプッシュ
npx supabase db push
```

または、Supabase Dashboardから直接SQLを実行:

1. [Supabase Dashboard](https://app.supabase.com/)にアクセス
2. プロジェクトを選択
3. 左メニューから「SQL Editor」をクリック
4. `supabase/migrations/013_create_google_adsense_tokens_table.sql` の内容をコピー
5. 貼り付けて「RUN」をクリック

### 3. 環境変数の設定

#### ローカル開発環境

`.env.local`ファイルに以下を追加:

```bash
# Google AdSense OAuth 2.0
GOOGLE_ADSENSE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_ADSENSE_CLIENT_SECRET=your-client-secret
GOOGLE_ADSENSE_REDIRECT_URI=http://localhost:3000/api/auth/adsense/callback
```

#### 本番環境（Vercel等）

環境変数に以下を設定:

```bash
GOOGLE_ADSENSE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_ADSENSE_CLIENT_SECRET=your-client-secret
GOOGLE_ADSENSE_REDIRECT_URI=https://your-domain.com/api/auth/adsense/callback
```

**重要**: 本番環境では、`GOOGLE_ADSENSE_REDIRECT_URI`を実際のドメインに変更し、Google Cloud ConsoleのOAuthクライアント設定にも同じURIを追加してください。

### 4. 動作確認と初回認証

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで `/admin/dashboard` にアクセス
3. 「Google AdSenseと連携」ボタンが表示されるので、クリック
4. Googleログイン画面が表示されるので、AdSenseアカウントでログイン
5. 権限の許可画面で「許可」をクリック
6. ダッシュボードにリダイレクトされ、AdSense収益データが表示される

**初回認証時の注意**:
- テストユーザーとして登録したGoogleアカウントでログインしてください
- 「このアプリは確認されていません」という警告が表示される場合がありますが、「詳細」→「(アプリ名)に移動」をクリックして続行できます
- これはOAuth同意画面が「テスト」モードのためです。本番公開する場合は、Googleの審査を受ける必要があります

収益データが表示されない場合は、以下を確認してください:

- AdSense Management APIが有効化されているか
- OAuth 2.0クライアントIDが正しく設定されているか
- リダイレクトURIが正しく設定されているか
- Supabaseのマイグレーションが実行されているか
- 環境変数が正しく設定されているか
- サーバーログにエラーメッセージが出力されていないか

## 表示されるデータ

ダッシュボードには以下のAdSenseデータが表示されます:

- **収益サマリー**
  - 合計収益
  - 合計クリック数
  - 合計表示回数
  - 平均CTR（クリック率）
  - 平均RPM（1000インプレッション単価）

- **収益推移グラフ**
  - 日別の収益データをグラフで表示

- **パフォーマンス指標**
  - CTR推移（クリック率の日別データ）
  - RPM推移（1000インプレッション単価の日別データ）

## トラブルシューティング

### エラー: "このアプリは確認されていません"

これは正常な動作です。OAuth同意画面が「テスト」モードの場合に表示されます。
- 「詳細」→「(アプリ名)に移動」をクリックして続行してください
- 本番環境では、Googleの審査を受けてアプリを公開することをお勧めします

### エラー: "OAuth 2.0 credentials are not configured"

環境変数が正しく設定されていません:
- `.env.local`に`GOOGLE_ADSENSE_CLIENT_ID`、`GOOGLE_ADSENSE_CLIENT_SECRET`、`GOOGLE_ADSENSE_REDIRECT_URI`が設定されているか確認
- サーバーを再起動してください

### エラー: "User not authenticated"

Supabaseにログインしていません:
- `/admin/dashboard`にアクセスする前に、Supabase認証でログインしてください

### データが表示されない

- AdSenseアカウントに収益データが存在するか確認
- 正しいGoogleアカウント（AdSenseアカウント）でログインしているか確認
- 期間を変更してデータがあるか確認（過去7日、14日、30日、90日）
- Supabaseのテーブル`google_adsense_tokens`にトークンが保存されているか確認

### 認証をやり直したい

1. Supabase Dashboardで`google_adsense_tokens`テーブルからレコードを削除
2. ダッシュボードに戻り、「Google AdSenseと連携」ボタンをクリック
3. 再度認証フローを実行

## セキュリティに関する注意事項

- **OAuth 2.0クライアントシークレット**は機密情報です
- `.env.local`ファイルは絶対にGitにコミットしないでください
- 本番環境では環境変数として設定してください
- アクセストークンとリフレッシュトークンはSupabaseに安全に保存されます
- Row Level Security (RLS)により、ユーザーは自分のトークンにのみアクセスできます

## OAuth 2.0とサービスアカウントの違い

### OAuth 2.0（この実装）
**メリット**:
- 個人AdSenseアカウントでも使用可能
- ユーザー認証が簡単
- 権限管理が明確

**デメリット**:
- 初回認証が必要
- トークンの有効期限管理が必要（自動更新実装済み）

### サービスアカウント
**メリット**:
- 自動実行に適している
- ユーザー操作不要

**デメリット**:
- AdSenseビジネスアカウントが必要
- 個人アカウントでは使用できない場合がある

## 参考リンク

- [AdSense Management API ドキュメント](https://developers.google.com/adsense/management)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google AdSense](https://www.google.com/adsense/)
- [OAuth 2.0 認証フロー](https://developers.google.com/identity/protocols/oauth2)
