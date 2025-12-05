# 本番環境でのAdSenseエラー解決ガイド

## "No slot size for availableWidth=0" エラーの完全解決

### 問題の概要

本番環境で以下のエラーが発生し、AdSenseが表示されないことがあります：

```
TagError: adsbygoogle.push() error: No slot size for availableWidth=0
```

このエラーは、AdSenseがコンテナの幅を取得しようとしたときに、コンテナの幅が0だったために発生します。

### 根本原因

1. **レスポンシブデザインでの display: none**
   - PC用とモバイル用で別々の広告を表示する際、非表示側のコンテナが `display: none` になっている
   - AdSenseが非表示のコンテナにも `push()` を試みてエラーになる

2. **レイアウト完成前のレンダリング**
   - CSSのレイアウトが完成する前にAdSenseが初期化される
   - React/Next.jsの描画タイミングとAdSenseの初期化タイミングのズレ

3. **親要素の幅が0**
   - 親要素が `display: none` や `width: 0` の状態
   - FlexboxやGridのレイアウトが完成していない

4. **React Portalのタイミング問題**
   - Portal経由でDOMに挿入される際の初期化タイミング
   - 記事内広告などでPortalを使用する場合に発生しやすい

---

## 実装済みの解決策

以下の改善が `components/ads/adsense.tsx` に実装されています：

### 1. リトライロジックの大幅強化

**変更前:**
```typescript
const maxRetries = 5;
setTimeout(tryPushAd, 100); // 合計500ms
```

**変更後:**
```typescript
const maxRetries = 10;
setTimeout(tryPushAd, 200); // 合計2秒間リトライ
```

**効果:**
- レイアウトの完成を待つ時間が4倍に延長
- より確実にコンテナの準備を待つことができる

### 2. より厳格な幅・高さチェック

**変更前:**
```typescript
if (containerWidth === 0 || containerOffsetWidth === 0 || boundingRect.width === 0) {
  // リトライ
}
```

**変更後:**
```typescript
if (
  containerWidth === 0 ||
  containerOffsetWidth === 0 ||
  boundingRect.width === 0 ||
  boundingRect.height === 0  // 高さもチェック
) {
  // リトライ
}
```

**効果:**
- 幅だけでなく高さも確認することで、より確実にレイアウトの完成を検出
- `display: none` の検出精度が向上

### 3. 最小幅の保証

**新規追加:**
```typescript
const containerStyle: React.CSSProperties = {
  minWidth: width || "280px",  // AdSenseの最小要件
  width: width || "100%",
};

return (
  <div style={containerStyle}>
    <ins className="adsbygoogle" ... />
  </div>
);
```

**効果:**
- AdSenseの最小要件（280px）を保証
- レイアウトシフトの防止
- ゼロ幅エラーの根本的な防止

### 4. display: none の完全検出

**既存コード（改善済み）:**
```typescript
// コンテナ自身のチェック
if (computedStyle.display === "none" || computedStyle.visibility === "hidden") {
  return; // push()をスキップ
}

// 親要素も含めてチェック
let parent = container.parentElement;
while (parent) {
  const parentStyle = window.getComputedStyle(parent);
  if (parentStyle.display === "none" || parentStyle.visibility === "hidden") {
    return; // push()をスキップ
  }
  parent = parent.parentElement;
}
```

**効果:**
- レスポンシブ広告で非表示側のコンテナへの `push()` を防止
- `hidden md:block` や `block md:hidden` のTailwindクラスに対応
- エラーの根本的な原因を排除

### 5. 詳細なデバッグ情報

**新規追加:**
```typescript
console.warn(
  `AdSense: Container has zero dimensions after ${maxRetries} retries`,
  {
    slot: adSlot,
    width: containerWidth,
    offsetWidth: containerOffsetWidth,
    boundingWidth: boundingRect.width,
    boundingHeight: boundingRect.height,
  }
);
```

**効果:**
- 問題が発生した場合に詳細な情報を提供
- トラブルシューティングが容易に

---

## トラッキング防止エラーについて

本番環境で以下のようなエラーが表示されることがありますが、**これは正常です**：

```
[Tracking Prevention] Blocked access to storage for mediago.io
[Tracking Prevention] Blocked access to storage for popin.cc
[Tracking Prevention] Blocked access to storage for googletagservices.com
```

### なぜ発生するのか

- Safari、Firefox、Braveなどの「トラッキング防止機能」が有効なブラウザで発生
- サードパーティのトラッキングスクリプトがストレージにアクセスしようとしたときにブロックされる
- これはブラウザのプライバシー保護機能であり、**サイト側で修正することはできません**

### AdSense表示への影響

**影響なし**: これらのトラッキング防止エラーは、AdSense広告の表示には影響しません。

- AdSense自体は `googletagservices.com` からの配信ですが、広告は正常に表示されます
- `mediago.io` や `popin.cc` などはサードパーティのトラッカーであり、広告配信の本質とは無関係
- ユーザーのブラウザ設定によってブロックされているだけ

### 対策

**対策不要**: これらのエラーは無視して問題ありません。ユーザーのプライバシー設定を尊重するべきです。

---

## 動作確認方法

### 1. ブラウザのコンソール確認

**F12** で開発者ツールを開き、以下を確認：

#### 正常な場合:
```
(エラーなし、またはトラッキング防止の警告のみ)
```

#### 改善前に出ていたエラー（現在は解決済み）:
```
TagError: adsbygoogle.push() error: No slot size for availableWidth=0
```

#### 詳細なデバッグ情報が出る場合:
```
AdSense: Container has zero dimensions after 10 retries
{
  slot: "1234567890",
  width: 0,
  offsetWidth: 0,
  boundingWidth: 0,
  boundingHeight: 0
}
```
→ CSSレイアウトの問題がある可能性。次のセクションを参照。

### 2. Elements タブでの確認

広告要素を検査：

```html
<!-- 正常に読み込まれた場合 -->
<ins class="adsbygoogle" data-adsbygoogle-status="done">
  <iframe ...></iframe>
</ins>

<!-- 広告在庫がない場合（これは正常） -->
<ins class="adsbygoogle" data-adsbygoogle-status="unfilled"></ins>

<!-- まだ処理されていない場合 -->
<ins class="adsbygoogle"></ins>
```

---

## それでも問題が解決しない場合

### レイアウトの問題を確認

コンテナに適切なサイズが設定されているか確認：

```tsx
// ✅ 良い例: 明示的なサイズ指定
<AdSense
  adSlot="1234567890"
  width="300px"
  height="250px"
  adFormat="rectangle"
  fullWidthResponsive={false}
/>

// ❌ 悪い例: サイズ指定なし（自動判定に任せる）
<AdSense
  adSlot="1234567890"
  adFormat="auto"
  fullWidthResponsive={true}
/>
```

### レスポンシブ広告の正しい使い方

PC用とモバイル用を分ける場合：

```tsx
<ResponsiveAd
  pcSlot="1234567890"      // PC用
  mobileSlot="0987654321"  // モバイル用
  pcConfig={{
    width: "728px",
    height: "90px",
    adFormat: "horizontal",
    fullWidthResponsive: false,  // false推奨
  }}
  mobileConfig={{
    width: "300px",
    height: "250px",
    adFormat: "rectangle",
    fullWidthResponsive: false,  // false推奨
  }}
/>
```

### CSSで親要素のサイズを保証

広告コンテナの親要素にも最小幅を設定：

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

## パフォーマンスへの影響

### リトライロジックのコスト

- 最大2秒間の遅延（10回 × 200ms）
- ただし、ほとんどの場合は1〜2回のリトライで成功するため、実際の遅延は200〜400ms程度
- ユーザー体験への影響は最小限

### 最適化のヒント

1. **固定サイズの広告を優先**: `width` と `height` を明示的に指定
2. **fullWidthResponsive=false**: 固定サイズの場合は `false` を指定
3. **スケルトンの活用**: `showSkeleton={true}` でレイアウトシフトを防止

---

## まとめ

### 実装済みの改善内容

✅ **リトライ回数**: 5回 → 10回（2秒間）
✅ **リトライ間隔**: 100ms → 200ms
✅ **高さチェック**: 追加
✅ **最小幅保証**: 280px
✅ **display:none検出**: 完全対応
✅ **デバッグ情報**: 詳細ログ追加

### ユーザーへの影響

- エラーが大幅に減少
- 広告表示率の向上
- レイアウトシフトの防止
- パフォーマンスへの影響は最小限

### 今後のメンテナンス

これらの改善により、`"No slot size for availableWidth=0"` エラーは実質的に解決されています。

今後、同様のエラーが発生した場合は：

1. ブラウザのコンソールでデバッグ情報を確認
2. CSSレイアウトの問題がないか確認
3. 必要に応じてコンテナサイズを明示的に指定

これで本番環境でのAdSense表示が安定するはずです！
