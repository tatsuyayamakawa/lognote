# Google Analytics 4 セットアップガイド

このドキュメントでは、ブログにGoogle Analytics 4 (GA4)を統合する手順を説明します。

## 1. Google Analytics 4 プロパティの作成

### 1.1 Google Analyticsアカウントにログイン

1. [Google Analytics](https://analytics.google.com/)にアクセス
2. Googleアカウントでログイン

### 1.2 プロパティを作成

1. 「管理」（歯車アイコン）をクリック
2. 「プロパティを作成」をクリック
3. プロパティの詳細を入力：
   - プロパティ名: `整えて、創る。`（任意の名前）
   - レポートのタイムゾーン: `日本`
   - 通貨: `日本円 (¥)`
4. 「次へ」をクリック

### 1.3 ビジネスの詳細を入力

1. 業種: `ブログ・メディア`など適切なものを選択
2. ビジネスの規模: 該当するものを選択
3. 「次へ」をクリック

### 1.4 ビジネス目標を選択

- 「ベースライン レポートの取得」を選択
- 「作成」をクリック

### 1.5 利用規約に同意

- 該当する地域を選択
- 利用規約に同意
- 「同意する」をクリック

## 2. データストリームの設定

### 2.1 ウェブデータストリームを作成

1. 「データストリーム」セクションで「ウェブ」を選択
2. 以下の情報を入力：
   - ウェブサイトのURL: `https://your-domain.com`（本番環境のURL）
   - ストリーム名: `整えて、創る。 - 本番`
3. 「ストリームを作成」をクリック

### 2.2 測定IDをコピー

ストリームの詳細ページに表示される**測定ID**（`G-XXXXXXXXXX`の形式）をコピーします。

## 3. Next.jsアプリケーションへの統合

### 3.1 環境変数の設定

`.env.local`ファイルに測定IDを追加します：

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**重要**:
- `.env.local`ファイルはgitにコミットしないでください
- 本番環境では、ホスティングサービスの環境変数設定で`NEXT_PUBLIC_GA_ID`を設定してください

### 3.2 実装の確認

アプリケーションには既にGoogle Analyticsが統合されています：

- コンポーネント: `components/analytics/google-analytics.tsx`
- ルートレイアウト: `app/layout.tsx`（GoogleAnalyticsコンポーネントを配置済み）

## 4. 動作確認

### 4.1 開発環境での確認

1. 開発サーバーを起動：
   ```bash
   npm run dev
   ```

2. ブラウザで`http://localhost:3000`にアクセス

3. ブラウザの開発者ツールを開く（F12）

4. Networkタブで`google-analytics.com`や`gtag`へのリクエストを確認

### 4.2 Google Analyticsでの確認

1. Google Analyticsにログイン
2. 「レポート」→「リアルタイム」を開く
3. サイトにアクセスして、アクティブユーザーが表示されることを確認

**注意**: 開発環境からのアクセスもカウントされるため、本番環境のみで有効にしたい場合は環境変数の設定を本番環境のみにしてください。

## 5. 本番環境へのデプロイ

### Vercelの場合

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」→「Environment Variables」に移動
3. 以下の環境変数を追加：
   - Name: `NEXT_PUBLIC_GA_ID`
   - Value: `G-XXXXXXXXXX`（コピーした測定ID）
   - Environment: `Production`（本番環境のみ有効にする場合）
4. 「Save」をクリック
5. 再デプロイ

### その他のホスティングサービス

各サービスのドキュメントに従って環境変数`NEXT_PUBLIC_GA_ID`を設定してください。

## 6. プライバシー設定（推奨）

### 6.1 Cookieバナーの実装

GDPR・CCPA対応のため、Cookieバナーの実装を推奨します。

必要なパッケージ：
```bash
npm install react-cookie-consent
```

### 6.2 プライバシーポリシーの作成

Google Analyticsを使用していることをプライバシーポリシーに記載してください。

記載例：
> 当サイトではGoogle Analyticsを使用して、アクセス解析を行っています。Google Analyticsは、Cookieを使用して、個人を特定する情報を含まずにウェブサイトの利用状況を収集します。

## 7. GA4の主要機能

### イベント追跡

カスタムイベントを追跡する場合：

```typescript
// components/analytics/google-analytics.tsx に追加
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams)
  }
}
```

使用例：
```typescript
import { trackEvent } from '@/components/analytics/google-analytics'

// ボタンクリックを追跡
trackEvent('button_click', {
  button_name: 'share_article',
  article_title: 'My Article',
})
```

### ページビュー

Next.jsの`@next/third-parties/google`パッケージは自動的にページビューを追跡します。

## トラブルシューティング

### データが表示されない場合

1. **測定IDが正しいか確認**
   - `.env.local`の`NEXT_PUBLIC_GA_ID`が正しいか確認
   - `G-`で始まる測定IDであることを確認

2. **環境変数が読み込まれているか確認**
   - 開発サーバーを再起動
   - `console.log(process.env.NEXT_PUBLIC_GA_ID)`で確認

3. **広告ブロッカーを無効化**
   - 広告ブロッカーがGoogle Analyticsをブロックしている可能性があります

4. **ブラウザのDo Not Track設定を確認**
   - 一部のブラウザではDo Not Track設定でトラッキングがブロックされます

### リアルタイムレポートに表示されない

- GA4は数秒から数分の遅延がある場合があります
- ブラウザのシークレットモードで試してみてください

## 参考リンク

- [Google Analytics 4 公式ドキュメント](https://support.google.com/analytics/answer/10089681)
- [Next.js Third Parties ドキュメント](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-analytics)
- [@next/third-parties GitHub](https://github.com/vercel/next.js/tree/canary/packages/third-parties)
