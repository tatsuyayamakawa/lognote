# AdSense広告が表示されない場合のトラブルシューティング

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

## 解決策

### オプション1: 改善版AdSenseコンポーネントを使用（推奨）

改善版は以下の機能を持っています:
- リトライ回数増加（10回まで）
- 待機時間の延長（200ms）
- より詳細なエラー検出
- フォールバックモード対応

#### 使い方

```tsx
import { AdSenseImproved } from "@/components/ads/adsense-improved";

// 基本的な使い方
<AdSenseImproved
  adSlot="1234567890"
  adFormat="rectangle"
/>

// フォールバックモード指定
<AdSenseImproved
  adSlot="1234567890"
  adFormat="rectangle"
  fallbackMode="placeholder"  // "hide" | "placeholder" | "keep"
/>
```

**フォールバックモード:**
- `hide` (デフォルト): 広告が表示されない場合は非表示
- `placeholder`: プレースホルダーを表示（開発・デバッグ用）
- `keep`: そのまま残す（トラブルシューティング用）

### オプション2: 静的埋め込みコンポーネント（より確実）

シンプルな実装で、より確実に広告を表示:

```tsx
import { AdSenseStatic } from "@/components/ads/adsense-static";

<AdSenseStatic
  adSlot="1234567890"
  adFormat="rectangle"
  width="300px"
  height="250px"
/>
```

### オプション3: 直接HTML埋め込み（最も確実）

記事内に直接AdSenseコードを埋め込む:

1. **アフィリエイトボックス機能を使用**
   - プロバイダー: 任意（"amazon"など）
   - アフィリエイトコードに以下を貼り付け:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7839828582645189"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-7839828582645189"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

2. **メリット**:
   - Reactコンポーネントを経由しないため確実
   - AdSense公式のコードをそのまま使用
   - デバッグが簡単

3. **デメリット**:
   - 管理画面から一元管理できない
   - 記事ごとに設定が必要

## 開発環境での確認方法

### 1. fallbackModeを使用

```tsx
<AdSenseImproved
  adSlot="1234567890"
  fallbackMode="placeholder"
/>
```

これにより、広告が読み込めない場合でもプレースホルダーが表示されます。

### 2. ブラウザの開発者ツールで確認

**Console:**
```
AdSense: Container width is 0 after 10 retries
```
→ コンテナの表示問題

```
AdSense script not loaded
```
→ AdSenseスクリプトの読み込み失敗

**Elements:**
```html
<ins class="adsbygoogle" data-adsbygoogle-status="done">
  <iframe>...</iframe>
</ins>
```
→ `data-adsbygoogle-status="done"`で正常読み込み

```html
<ins class="adsbygoogle" data-adsbygoogle-status="unfilled">
</ins>
```
→ `unfilled`は広告在庫なし

### 3. AdSenseアカウントで確認

- AdSense管理画面 > レポート
- 「広告リクエスト」「広告表示回数」を確認
- 「マッチ率」が低い場合は広告在庫不足

## ベストプラクティス

### 1. 広告枠を適切に設定

```tsx
// ❌ 悪い例: サイズ指定なし（レイアウトシフト）
<AdSenseImproved adSlot="123" />

// ✅ 良い例: サイズ指定あり
<AdSenseImproved
  adSlot="123"
  width="300px"
  height="250px"
/>
```

### 2. スケルトンを表示

```tsx
<AdSenseImproved
  adSlot="123"
  showSkeleton={true}
  skeletonHeight="250px"
/>
```

### 3. フォールバックを用意

本番環境では`fallbackMode="hide"`、開発環境では`fallbackMode="placeholder"`を使用:

```tsx
<AdSenseImproved
  adSlot="123"
  fallbackMode={process.env.NODE_ENV === 'development' ? 'placeholder' : 'hide'}
/>
```

### 4. 広告密度に注意

AdSenseポリシーでは、画面に対する広告の割合が制限されています:
- コンテンツと広告のバランスを保つ
- 広告を詰め込みすぎない
- ユーザー体験を優先

## よくある質問

### Q1: 開発環境では表示されないが、本番では表示される？
**A:** AdSenseは開発環境（localhost）では広告が配信されないことがあります。実際の本番URLでテストしてください。

### Q2: 広告が表示されたり表示されなかったりする
**A:** これは正常です。Googleが広告在庫や入札状況に基づいて自動的に制御しています。

### Q3: すべてのページで広告が表示されない
**A:**
1. AdSenseアカウントが有効か確認
2. 広告コードが正しいか確認
3. ポリシー違反がないか確認

### Q4: 記事内広告だけ表示されない
**A:**
1. H2が2つ以上あるか確認
2. 広告挿入位置のDOM構造を確認
3. 記事内広告専用のスロットIDを使用しているか確認

## まとめ

### 推奨する対応順序

1. **まず現状確認**
   - ブラウザの開発者ツールでエラーチェック
   - AdSense管理画面でレポート確認

2. **改善版コンポーネントを試す**
   - `AdSenseImproved`に置き換え
   - `fallbackMode="placeholder"`でデバッグ

3. **それでもダメなら静的埋め込み**
   - `AdSenseStatic`に置き換え
   - またはアフィリエイトボックスで直接埋め込み

4. **最終手段: 直接HTML埋め込み**
   - 記事ごとにアフィリエイトボックスで管理

### 広告表示率を上げるコツ

- ✅ **質の高いコンテンツ**: 広告主が入札したくなる内容
- ✅ **トラフィック増加**: ページビューを増やす
- ✅ **適切な広告配置**: ユーザーの視線の流れを考慮
- ✅ **ページ速度改善**: 広告読み込みを早くする
- ✅ **モバイル最適化**: モバイルでの表示を重視

収益化を成功させるには、技術的な対策だけでなく、コンテンツの質とユーザー体験の向上が重要です！
