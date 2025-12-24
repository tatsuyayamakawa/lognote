# AdSense トラブルシューティングガイド

このドキュメントでは、AdSense広告が表示されない問題の解決方法と、本番環境での一般的なエラーへの対処法を説明します。

## 目次
- [広告が表示されない主な原因](#広告が表示されない主な原因)
- [本番環境での一般的なエラー](#本番環境での一般的なエラー)
- [開発環境での確認方法](#開発環境での確認方法)
- [ベストプラクティス](#ベストプラクティス)
- [よくある質問](#よくある質問)

---

## 広告が表示されない主な原因

### 1. Google側の配信制御
- **広告在庫不足**: 入札する広告主がいない
- **地域・時間帯**: 特定の地域や時間帯で広告が少ない
- **コンテンツマッチング**: 記事内容に合う広告がない
- **ページビュー不足**: トラフィックが少ないと広告配信が限定的

### 2. 技術的な問題
- **広告ブロッカー**: ユーザーが広告ブロッカーを使用
- **JavaScriptエラー**: 他のスクリプトとの競合
- **レンダリングタイミング**: SPAでの動的読み込み問題
- **設定ミス**: AdSenseの設定や広告コード

### 3. ポリシー違反
- **コンテンツポリシー**: 禁止コンテンツ
- **無効なトラフィック**: 不正クリック検出
- **広告配置**: ポリシー違反の配置

---

## 本番環境での一般的なエラー

### "No slot size for availableWidth=0" エラー

#### 問題の概要
```
TagError: adsbygoogle.push() error: No slot size for availableWidth=0
```

このエラーは、AdSenseがコンテナの幅を取得しようとしたときに、コンテナの幅が0だったために発生します。

#### 根本原因

1. **レスポンシブデザインでの display: none**
   - PC用とモバイル用で別々の広告を表示する際、非表示側のコンテナが `display: none` になっている
   - AdSenseが非表示のコンテナにも `push()` を試みてエラーになる

2. **レイアウト完成前のレンダリング**
   - CSSのレイアウトが完成する前にAdSenseが初期化される
   - React/Next.jsの描画タイミングとAdSenseの初期化タイミングのズレ

3. **親要素の幅が0**
   - 親要素が `display: none` や `width: 0` の状態
   - FlexboxやGridのレイアウトが完成していない

#### 実装済みの解決策

現在の実装（`components/ads/adsense.tsx`）では以下の対策が施されています：

**1. リトライロジック**
- 最大10回、200ms間隔でリトライ（合計2秒間）
- コンテナの幅・高さが0でなくなるまで待機

**2. 厳格な幅・高さチェック**
```typescript
if (
  containerWidth === 0 ||
  containerOffsetWidth === 0 ||
  boundingRect.width === 0 ||
  boundingRect.height === 0
) {
  // リトライ
}
```

**3. 最小幅の保証**
```typescript
const containerStyle: React.CSSProperties = {
  minWidth: width || "280px",  // AdSenseの最小要件
  width: width || "100%",
};
```

**4. display: none の完全検出**
```typescript
// コンテナ自身と親要素のdisplay:noneを検出してpush()をスキップ
let parent = container.parentElement;
while (parent) {
  const parentStyle = window.getComputedStyle(parent);
  if (parentStyle.display === "none" || parentStyle.visibility === "hidden") {
    return; // push()をスキップ
  }
  parent = parent.parentElement;
}
```

#### それでも問題が解決しない場合

**レイアウトの問題を確認:**

```tsx
// ✅ 良い例: 明示的なサイズ指定
<AdSense
  adSlot="1234567890"
  width="300px"
  height="250px"
  adFormat="rectangle"
  fullWidthResponsive={false}
/>

// ❌ 悪い例: サイズ指定なし
<AdSense
  adSlot="1234567890"
  adFormat="auto"
  fullWidthResponsive={true}
/>
```

**レスポンシブ広告の正しい使い方:**

```tsx
<ResponsiveAd
  pcSlot="1234567890"
  mobileSlot="0987654321"
  pcConfig={{
    width: "728px",
    height: "90px",
    adFormat: "horizontal",
    fullWidthResponsive: false,
  }}
  mobileConfig={{
    width: "300px",
    height: "250px",
    adFormat: "rectangle",
    fullWidthResponsive: false,
  }}
/>
```

---

### トラッキング防止エラー

本番環境で以下のようなエラーが表示されることがありますが、**これは正常です**：

```
[Tracking Prevention] Blocked access to storage for mediago.io
[Tracking Prevention] Blocked access to storage for popin.cc
[Tracking Prevention] Blocked access to storage for googletagservices.com
```

#### なぜ発生するのか
- Safari、Firefox、Braveなどの「トラッキング防止機能」が有効なブラウザで発生
- サードパーティのトラッキングスクリプトがストレージにアクセスしようとしたときにブロックされる
- これはブラウザのプライバシー保護機能であり、**サイト側で修正することはできません**

#### AdSense表示への影響
**影響なし**: これらのトラッキング防止エラーは、AdSense広告の表示には影響しません。

#### 対策
**対策不要**: これらのエラーは無視して問題ありません。ユーザーのプライバシー設定を尊重するべきです。

---

## 開発環境での確認方法

### 1. ブラウザの開発者ツールで確認

**Console:**
```
AdSense: Container has zero dimensions after 10 retries
{
  slot: "1234567890",
  width: 0,
  ...
}
```
→ コンテナの表示問題

```
AdSense script not loaded
```
→ AdSenseスクリプトの読み込み失敗

**Elements:**
```html
<!-- 正常に読み込まれた場合 -->
<ins class="adsbygoogle" data-adsbygoogle-status="done">
  <iframe>...</iframe>
</ins>

<!-- 広告在庫がない場合（これは正常） -->
<ins class="adsbygoogle" data-adsbygoogle-status="unfilled"></ins>
```

### 2. AdSenseアカウントで確認

- AdSense管理画面 > レポート
- 「広告リクエスト」「広告表示回数」を確認
- 「マッチ率」が低い場合は広告在庫不足

### 3. 開発環境での注意点

**重要**: AdSenseは開発環境（localhost）では広告が配信されないことがあります。

現在の実装では、開発環境（`NODE_ENV !== "production"`）ではスケルトンのみを表示し、広告の初期化を行いません。実際の動作確認は本番環境で行ってください。

---

## ベストプラクティス

### 1. 広告枠を適切に設定

```tsx
// ✅ 良い例: サイズ指定あり
<AdSense
  adSlot="123"
  width="300px"
  height="250px"
/>

// ❌ 悪い例: サイズ指定なし（レイアウトシフト）
<AdSense adSlot="123" />
```

### 2. スケルトンを表示

現在の実装では、開発環境やロード中に自動的にスケルトンが表示されます：

```tsx
{showSkeleton && (
  <div className="animate-pulse bg-gray-200 rounded" style={{ height: skeletonHeight }} />
)}
```

### 3. 広告密度に注意

AdSenseポリシーでは、画面に対する広告の割合が制限されています:
- コンテンツと広告のバランスを保つ
- 広告を詰め込みすぎない
- ユーザー体験を優先

### 4. CSSで親要素のサイズを保証

```css
/* 例: 記事上広告のコンテナ */
.article-top-ad-container {
  min-width: 300px;
  width: 100%;
  max-width: 728px;
  margin: 0 auto;
}
```

---

## よくある質問

### Q1: 開発環境では表示されないが、本番では表示される？
**A:** AdSenseは開発環境（localhost）では広告が配信されないことがあります。また、現在の実装では開発環境でスケルトンのみ表示するようになっています。実際の本番URLでテストしてください。

### Q2: 広告が表示されたり表示されなかったりする
**A:** これは正常です。Googleが広告在庫や入札状況に基づいて自動的に制御しています。`data-adsbygoogle-status="unfilled"`の状態は広告在庫がないことを意味します。

### Q3: すべてのページで広告が表示されない
**A:**
1. AdSenseアカウントが有効か確認
2. 環境変数が正しく設定されているか確認（本番環境のみ表示）
3. ポリシー違反がないか確認
4. 広告スロットIDが正しいか確認

### Q4: 記事内広告だけ表示されない
**A:**
1. H2が2つ以上あるか確認
2. 広告挿入位置のDOM構造を確認
3. 記事内広告専用のスロットIDを使用しているか確認

---

## 動作確認チェックリスト

### 環境変数の確認
- [ ] 本番環境で `NODE_ENV=production` が設定されている
- [ ] AdSense公開者ID（ca-pub-7839828582645189）が正しい
- [ ] 広告スロットIDが正しい

### コンポーネントの確認
- [ ] `components/ads/adsense.tsx` が最新版
- [ ] `width` と `height` が明示的に指定されている
- [ ] `fullWidthResponsive={false}` が設定されている（固定サイズの場合）

### レイアウトの確認
- [ ] 親要素の幅が0でない
- [ ] `display: none` になっていない
- [ ] FlexboxやGridのレイアウトが完成している

### ブラウザでの確認
- [ ] コンソールにエラーがない（トラッキング防止エラーは無視）
- [ ] `data-adsbygoogle-status="done"` または `"unfilled"` になっている
- [ ] 広告ブロッカーが無効になっている

---

## まとめ

### 現在の実装状況

✅ **リトライロジック**: 10回、200ms間隔（合計2秒間）
✅ **最小幅保証**: 280px
✅ **display:none検出**: 完全対応
✅ **開発環境**: スケルトンのみ表示
✅ **本番環境**: 自動初期化とエラーハンドリング

### 推奨する対応順序

1. **まず現状確認**
   - ブラウザの開発者ツールでエラーチェック
   - AdSense管理画面でレポート確認
   - 本番環境かどうか確認（`NODE_ENV`）

2. **広告設定の見直し**
   - 明示的なサイズ指定（`width`, `height`）
   - `fullWidthResponsive={false}` の設定
   - 適切な広告フォーマットの選択

3. **レイアウトの調整**
   - 親要素のサイズ確認
   - CSSレイアウトの最小幅設定
   - レスポンシブ対応の確認

### 広告表示率を上げるコツ

- ✅ **質の高いコンテンツ**: 広告主が入札したくなる内容
- ✅ **トラフィック増加**: ページビューを増やす
- ✅ **適切な広告配置**: ユーザーの視線の流れを考慮
- ✅ **ページ速度改善**: 広告読み込みを早くする
- ✅ **モバイル最適化**: モバイルでの表示を重視

収益化を成功させるには、技術的な対策だけでなく、コンテンツの質とユーザー体験の向上が重要です！

---

## 関連ドキュメント

- [AdSense設定ガイド](01-adsense-setup.md) - OAuth 2.0認証の設定方法
- [広告レイアウトエディタ](04-ad-layout-editor.md) - 管理画面での広告設定
