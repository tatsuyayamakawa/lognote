# Google Tag Manager (GTM) セットアップガイド

このドキュメントでは、ブログにGoogle Tag Manager (GTM)を統合し、Google Analytics 4 (GA4)を設定する手順を説明します。

## なぜGTMを使うのか？

- **一元管理**: GA4、広告タグ、その他の計測ツールを1つの場所で管理
- **コード変更不要**: タグの追加・変更にコード変更が不要
- **柔軟性**: カスタムイベント、変数、トリガーを自由に設定可能
- **バージョン管理**: タグ設定の履歴管理と復元が可能

## 1. Google Tag Manager アカウントの作成

### 1.1 GTMアカウントにアクセス

1. [Google Tag Manager](https://tagmanager.google.com/)にアクセス
2. Googleアカウントでログイン
3. 「アカウントを作成」をクリック

### 1.2 アカウント情報を入力

1. **アカウント名**: `整えて、創る。`（任意の名前）
2. **国**: `日本`
3. 「続行」をクリック

### 1.3 コンテナを作成

1. **コンテナ名**: `整えて、創る。`（サイト名）
2. **ターゲット プラットフォーム**: `ウェブ`を選択
3. 「作成」をクリック
4. 利用規約に同意

### 1.4 コンテナIDをコピー

作成されたコンテナIDをコピーします（`GTM-XXXXXXX`の形式）。

## 2. Next.jsアプリケーションへの統合

### 2.1 環境変数の設定

`.env.local`ファイルにGTMコンテナIDを追加します：

```bash
# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**重要**:
- `.env.local`ファイルはgitにコミットしないでください
- 本番環境では、ホスティングサービスの環境変数設定で`NEXT_PUBLIC_GTM_ID`を設定してください

### 2.2 実装の確認

アプリケーションには既にGTMが統合されています：

- コンポーネント: `components/analytics/google-analytics.tsx`
- ルートレイアウト: `app/layout.tsx`（GoogleTagManagerコンポーネントを配置済み）

## 3. Google Analytics 4 (GA4) の設定

### 3.1 GA4プロパティを作成

1. [Google Analytics](https://analytics.google.com/)にアクセス
2. 「管理」をクリック
3. 「プロパティを作成」を選択
4. プロパティの詳細を入力：
   - プロパティ名: `整えて、創る。`
   - タイムゾーン: `日本`
   - 通貨: `日本円 (¥)`

### 3.2 データストリームを作成

1. 「データストリーム」→「ウェブ」を選択
2. ウェブサイトのURL: `https://your-domain.com`
3. ストリーム名: `整えて、創る。`
4. 「ストリームを作成」をクリック

### 3.3 測定IDをコピー

ストリームの詳細ページに表示される**測定ID**（`G-XXXXXXXXXX`）をコピーします。

## 4. GTMでGA4タグを設定

### 4.1 GTMダッシュボードに戻る

1. [Google Tag Manager](https://tagmanager.google.com/)を開く
2. 作成したコンテナを選択

### 4.2 GA4設定タグを作成

1. 「タグ」→「新規」をクリック
2. タグの設定：
   - タグ名: `GA4 設定`
   - タグタイプ: `Google アナリティクス: GA4 設定`を選択
   - 測定ID: コピーした`G-XXXXXXXXXX`を入力

3. トリガー設定：
   - トリガー: `All Pages`（初期化 - すべてのページ）を選択

4. 「保存」をクリック

### 4.3 GA4イベントタグを作成（オプション）

**ページビュー**は自動的に計測されますが、カスタムイベントを追加する場合：

1. 「タグ」→「新規」をクリック
2. タグ名: `GA4 イベント - カスタム`
3. タグタイプ: `Google アナリティクス: GA4 イベント`
4. 測定ID: `G-XXXXXXXXXX`
5. イベント名: カスタムイベント名を入力
6. トリガーを設定

### 4.4 変数の設定（推奨）

より詳細な計測のために変数を設定します：

1. 「変数」→「新規」をクリック
2. よく使う変数の例：
   - **Page URL**: URLの取得
   - **Page Path**: パスの取得
   - **Page Title**: ページタイトルの取得
   - **Click Element**: クリックされた要素
   - **Click Text**: クリックされたテキスト

これらの変数は「組み込み変数」から有効化できます。

## 5. GTMのプレビューとデバッグ

### 5.1 プレビューモードを開始

1. GTMダッシュボードで「プレビュー」をクリック
2. サイトのURL（`http://localhost:3000`）を入力
3. 「Connect」をクリック

### 5.2 Tag Assistantで確認

1. サイトが別タブで開き、Tag Assistantが表示されます
2. ページを移動して、タグが正しく発火するか確認
3. GA4設定タグが`All Pages`トリガーで発火することを確認

### 5.3 問題がある場合

- **タグが発火しない**: トリガー設定を確認
- **測定IDが間違っている**: GA4設定タグの測定IDを確認
- **GTMコンテナIDが間違っている**: 環境変数`NEXT_PUBLIC_GTM_ID`を確認

## 6. GTMの公開

### 6.1 バージョンを公開

1. プレビューで問題がないことを確認
2. 「送信」をクリック
3. バージョン名: `初期設定 - GA4統合`
4. バージョンの説明: `GA4設定タグを追加`（任意）
5. 「公開」をクリック

### 6.2 本番環境で確認

1. 本番環境のサイトにアクセス
2. ブラウザの開発者ツール（F12）を開く
3. Networkタブで`gtm.js`がロードされることを確認
4. GA4のリアルタイムレポートでアクセスが計測されることを確認

## 7. 本番環境へのデプロイ

### Vercelの場合

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」→「Environment Variables」に移動
3. 以下の環境変数を追加：
   - Name: `NEXT_PUBLIC_GTM_ID`
   - Value: `GTM-XXXXXXX`（コピーしたコンテナID）
   - Environment: `Production`
4. 「Save」をクリック
5. 再デプロイ

## 8. よく使うGTMタグの設定例

### 8.1 スクロール深度の計測

1. **変数を作成**:
   - 変数名: `Scroll Depth Threshold`
   - 変数タイプ: `スクロール深度のしきい値`
   - しきい値: `25,50,75,100`

2. **トリガーを作成**:
   - トリガー名: `スクロール深度`
   - トリガータイプ: `スクロール距離`
   - 垂直スクロール距離: `25,50,75,100`

3. **タグを作成**:
   - タグ名: `GA4 イベント - スクロール深度`
   - タグタイプ: `Google アナリティクス: GA4 イベント`
   - イベント名: `scroll`
   - トリガー: `スクロール深度`

### 8.2 外部リンククリックの計測

1. **トリガーを作成**:
   - トリガー名: `外部リンククリック`
   - トリガータイプ: `リンククリック`
   - タグ発火のタイミング: `一部のリンククリック`
   - 条件: `Page Hostname` `次と等しくない` `{{Click URL}}`のホスト名

2. **タグを作成**:
   - タグ名: `GA4 イベント - 外部リンク`
   - タグタイプ: `Google アナリティクス: GA4 イベント`
   - イベント名: `click_outbound`
   - イベントパラメータ:
     - `link_url`: `{{Click URL}}`
     - `link_text`: `{{Click Text}}`
   - トリガー: `外部リンククリック`

### 8.3 シェアボタンのクリック計測

1. **トリガーを作成**:
   - トリガー名: `シェアボタンクリック`
   - トリガータイプ: `クリック - すべての要素`
   - 条件: `Click Element` `CSSセレクタに一致する` `button[onclick*="share"]`

2. **タグを作成**:
   - タグ名: `GA4 イベント - シェア`
   - タグタイプ: `Google アナリティクス: GA4 イベント`
   - イベント名: `share`
   - イベントパラメータ:
     - `method`: `{{Click Text}}`（Twitter, Facebookなど）
   - トリガー: `シェアボタンクリック`

## 9. データレイヤー（DataLayer）の活用

より高度な計測のため、コードからdataLayerにイベントを送信できます。

### 9.1 カスタムイベントの送信

```typescript
// components/analytics/google-analytics.tsx に追加
export const pushDataLayer = (eventData: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(eventData)
  }
}
```

### 9.2 使用例

```typescript
import { pushDataLayer } from '@/components/analytics/google-analytics'

// 記事閲覧イベント
pushDataLayer({
  event: 'view_item',
  item_name: post.title,
  item_category: post.categories[0]?.name,
  item_id: post.id,
})

// シェアイベント
pushDataLayer({
  event: 'share',
  method: 'twitter',
  content_type: 'article',
  item_id: post.id,
})
```

### 9.3 GTMでdataLayerイベントを受け取る

1. **トリガーを作成**:
   - トリガー名: `カスタムイベント - view_item`
   - トリガータイプ: `カスタム イベント`
   - イベント名: `view_item`

2. **タグを作成**:
   - タグ名: `GA4 イベント - 記事閲覧`
   - タグタイプ: `Google アナリティクス: GA4 イベント`
   - イベント名: `view_item`
   - トリガー: `カスタムイベント - view_item`

## 10. トラブルシューティング

### GTMが読み込まれない

1. **環境変数を確認**:
   ```bash
   # .env.local
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   ```

2. **開発サーバーを再起動**

3. **ブラウザのコンソールでエラーを確認**

### タグが発火しない

1. **GTMプレビューモードで確認**
2. **トリガー条件を確認**
3. **変数の値を確認**

### GA4でデータが表示されない

1. **測定IDが正しいか確認**
2. **GTMでGA4設定タグが発火しているか確認**
3. **GA4のリアルタイムレポートで確認**（データ反映に数分かかる場合があります）

## 11. プライバシー対応

### Cookieバナーの実装

GDPR・CCPA対応のため、Cookieバナーの実装を推奨します。

```typescript
// GTMのコンセント管理
export const grantConsent = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    })
  }
}

export const denyConsent = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
    })
  }
}
```

## 参考リンク

- [Google Tag Manager 公式ドキュメント](https://support.google.com/tagmanager)
- [Next.js Third Parties - GTM](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-tag-manager)
- [GA4 イベントリファレンス](https://support.google.com/analytics/answer/9267735)
- [GTM DataLayer ガイド](https://developers.google.com/tag-platform/tag-manager/datalayer)
