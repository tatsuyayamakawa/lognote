# Analytics トラブルシューティング

Google Tag Manager、Google Analytics、Analytics Dashboard に関する問題の解決方法をまとめています。

## Google Tag Manager (GTM)

### データレイヤーが動作しない

**症状**: カスタムイベントが送信されない

**原因**:
- GTMコンテナが読み込まれていない
- `dataLayer`が初期化される前に`push()`を実行している

**解決策**:
```typescript
// components/analytics/google-analytics.tsx の pushDataLayer を使用
import { pushDataLayer } from '@/components/analytics/google-analytics';

// GTMが読み込まれているかチェックしてから実行
if (typeof window !== 'undefined' && (window as any).dataLayer) {
  pushDataLayer({
    event: 'custom_event',
    category: 'category_name',
    action: 'action_name'
  });
}
```

### GTMコンテナが読み込まれない

**確認事項**:
1. 環境変数 `NEXT_PUBLIC_GTM_ID` が設定されているか
2. GTMコンテナIDが正しいか（`GTM-XXXXXXX`形式）
3. ブラウザの広告ブロッカーが無効か

**確認方法**:
```bash
# .env.local を確認
cat .env.local | grep NEXT_PUBLIC_GTM_ID
```

---

## Google Analytics Data API

### ダッシュボードにデータが表示されない

**チェックリスト**:

#### 1. 環境変数の確認
```bash
# 必須の環境変数
GA4_PROPERTY_ID=264233355
GOOGLE_APPLICATION_CREDENTIALS=ga4-analytics-key.json  # ローカル
# または
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}  # 本番
```

#### 2. サービスアカウントの権限確認
1. [Google Analytics](https://analytics.google.com/) にアクセス
2. 管理 > プロパティのアクセス管理
3. サービスアカウントのメールアドレスが「閲覧者」として追加されているか確認

#### 3. Google Analytics Data API の有効化
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. APIとサービス > ライブラリ
3. 「Google Analytics Data API」が有効になっているか確認

#### 4. プロパティIDの確認
- Google Analytics > 管理 > プロパティ設定
- プロパティIDは数字のみ（例: `264233355`）
- `G-`で始まる測定IDではない

### "Permission denied" エラー

**症状**: API呼び出しで権限エラーが発生

**原因**:
- サービスアカウントがGA4プロパティに追加されていない
- 追加されているが権限が不足

**解決策**:
1. Google Analytics の管理画面でサービスアカウントを追加
2. 役割を「閲覧者」に設定
3. 変更後、5〜10分待ってから再試行

### "Invalid credentials" エラー

**ローカル開発環境**:
```bash
# JSONファイルのパスを確認
ls -la ga4-analytics-key.json

# パスが正しいか確認
echo $GOOGLE_APPLICATION_CREDENTIALS
```

**本番環境（Vercel）**:
1. 環境変数 `GOOGLE_SERVICE_ACCOUNT_JSON` が設定されているか確認
2. JSON形式が正しいか確認（1行にまとめる、改行は`\n`のまま）
3. 再デプロイ

### データが古い・更新されない

**原因**: キャッシュが有効になっている

**確認**:
- Analytics Data APIのレスポンスは24時間キャッシュされている可能性あり
- リアルタイムデータではなく、1〜2日遅延する場合がある

**解決策**:
- 開発中はキャッシュを無効化
- 本番環境では適切なキャッシュ時間を設定

---

## Google Search Console API

### 検索データが表示されない

**チェックリスト**:

#### 1. サイトの登録確認
1. [Google Search Console](https://search.google.com/search-console) にアクセス
2. 対象ドメインが登録されているか確認

#### 2. サービスアカウントの権限確認
1. Search Console > 設定 > ユーザーと権限
2. サービスアカウントが「オーナー」または「フル」権限で追加されているか確認

#### 3. データの遅延
- Search Consoleのデータは2〜3日遅延します
- 最新のデータが表示されないのは正常です

#### 4. カスタムドメインの設定（本番環境）
```env
# Vercel等でカスタムドメインを使用している場合
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

**重要**: `NEXT_PUBLIC_SITE_URL` はSearch Consoleに登録したURLと完全一致する必要があります。

### "Site not found" エラー

**原因**:
- `NEXT_PUBLIC_SITE_URL` が設定されていない（本番環境）
- Search Consoleに登録されていないURL

**解決策**:
1. カスタムドメインを使用している場合、`NEXT_PUBLIC_SITE_URL` を設定
2. Search Consoleで該当ドメインが登録されているか確認
3. URLは `https://` を含め、末尾のスラッシュは不要

---

## 一般的なトラブルシューティング

### 開発サーバーを再起動しても反映されない

**原因**: 環境変数の変更が反映されていない

**解決策**:
```bash
# 完全に停止
Ctrl+C

# .env.local を確認
cat .env.local

# 再起動
npm run dev
```

### ブラウザコンソールで確認

**F12** で開発者ツールを開き、以下を確認:

#### Network タブ
- GTMスクリプト（`gtm.js`）が読み込まれているか
- APIエンドポイント（`/api/analytics/*`）が正常にレスポンスを返しているか

#### Console タブ
- エラーメッセージを確認
- `(window as any).dataLayer` を実行してデータレイヤーを確認

---

## 関連ドキュメント

### セットアップガイド
- [Google Tag Manager設定](../analytics/01-google-tag-manager-setup.md)
- [Google Analytics設定](../analytics/02-google-analytics-setup.md)
- [Analytics Dashboard設定](../analytics/03-analytics-dashboard-setup.md)

### その他のトラブルシューティング
- [AdSense トラブルシューティング](adsense.md)
- [Supabase トラブルシューティング](supabase.md)
