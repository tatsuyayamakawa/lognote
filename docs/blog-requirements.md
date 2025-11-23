# 個人ブログ「整えて、創る。」要件定義書

## 1. プロジェクト概要

### 1.1 ブログ名
**整えて、創る。**

### 1.2 コンセプト
身体を整え、思考を整え、コードを書く。日常・技術・気づきを発信するブログ

### 1.3 運営者プロフィール
- 職業：整体師
- 技術：プログラミング（主にNext.jsを使ったウェブアプリ開発）
- 趣味：読書

---

## 2. 技術スタック

### 2.1 フロントエンド
- **Next.js 16**（App Router）
  - Turbopack（デフォルトバンドラー）
  - React 19.2
  - React Compiler（オプション、実験的に有効化）
- **TypeScript**
- **shadcn/ui**（UIコンポーネントライブラリ）
- **React Hook Form**（フォーム管理）
- **Zod**（スキーマバリデーション）

### 2.2 エディタ
- **Tiptap**（リッチテキストエディタ）

### 2.3 バックエンド・データベース
- **Supabase**
  - PostgreSQLデータベース
  - 認証機能
  - ストレージ（画像・サムネイル保存）
  - キャッシュストレージ（Analytics データ）

### 2.4 外部API連携
- **Google Analytics Data API (GA4)**
  - アクセス解析データ取得
- **Google Search Console API**
  - 検索パフォーマンスデータ取得
  - 検索クエリ分析

---

## 3. 機能要件

### 3.1 公開ページ（フロントエンド）

#### 3.1.1 トップページ
- ブログタイトル「整えて、創る。」の表示
- コンセプトの簡潔な説明
- 最新記事一覧（サムネイル、タイトル、公開日、カテゴリ）
- ページネーション機能

#### 3.1.2 記事一覧ページ
- 全記事の一覧表示
- カテゴリフィルタリング機能
  - 日常
  - 開発
  - 経営
  - 読書
  - ※後から追加可能な設計
- 検索機能（タイトル・本文の全文検索）
- ページネーション

#### 3.1.3 記事詳細ページ
- 記事タイトル
- サムネイル画像
- 公開日・更新日
- カテゴリタグ
- 記事本文（Tiptapでレンダリング）
- 目次（自動生成、見出しから抽出）
- 関連記事表示（同カテゴリの他記事）
- シェアボタン（Twitter、Facebook、はてなブックマーク）

#### 3.1.4 カテゴリページ
- カテゴリごとの記事一覧
- カテゴリの説明文

#### 3.1.5 プロフィールページ
- 運営者情報
- 自己紹介
- SNSリンク（任意）
- お問い合わせリンク

#### 3.1.6 お問い合わせページ
- コンタクトフォーム
  - 名前（必須）
  - メールアドレス（必須、メール形式チェック）
  - 件名（必須）
  - 本文（必須、最小文字数チェック）
- バリデーション
  - **React Hook Form**でフォーム管理
  - **Zod**でスキーマ定義・バリデーション
  - リアルタイムエラー表示
- reCAPTCHA（スパム対策）
- 送信後の完了メッセージ表示

### 3.2 管理画面（バックエンド）

#### 3.2.1 認証機能
**単一管理者向け認証システム**

##### 推奨実装方法
運営者のみがアクセスする前提のため、以下の2つのアプローチがあります：

**方式A：ログインフォーム方式（推奨）**
- メリット
  - 複数デバイスからアクセス可能
  - セッション管理が容易
  - 万が一の際にパスワード変更で対応可能
  - 一般的な認証フローで実装が容易
- デメリット
  - ログインの手間が発生

**方式B：環境変数トークン認証方式**
- メリット
  - ログイン不要
  - シンプルな実装
- デメリット
  - 複数デバイスで運用しにくい
  - トークン漏洩時の対応が困難

**本プロジェクトでの推奨：方式A（ログインフォーム）**

理由：
1. 複数デバイス（PC・スマホ・タブレット）から記事を書く可能性
2. セキュリティインシデント時の対応が柔軟
3. 将来的に共同執筆者を追加する可能性に対応可能
4. Next.jsとSupabaseの認証統合が成熟している

##### 実装仕様
- **認証方法**：Supabase Auth（Email + Password）
- **アクセス制御**
  - 管理画面URL：`/admin/*`
  - 認証ページURL：`/auth/login`（一般公開しない、直URL入力のみ）
  - ログイン後のリダイレクト：`/admin/dashboard`
- **セキュリティ対策**
  - 認証ページはrobots.txtでクローラーブロック
  - サイトマップに含めない
  - ナビゲーションメニューにリンク非表示
  - ログイン試行回数制限（Supabase機能）
  - セッションタイムアウト：7日間
  - IPアドレス制限（オプション：Supabase RLS）
- **機能**
  - ログイン
  - ログアウト
  - パスワードリセット（メール送信）
  - セッション管理
  - Remember Me機能（オプション）

#### 3.2.2 管理者ダッシュボード
トップページ（`/admin/dashboard`）に以下の情報を表示

##### ダッシュボード概要
- **統計情報**
  - 総記事数（公開 / 下書き / 非公開の内訳）
  - 総カテゴリ数
  - 今月の投稿数
  - 総閲覧数（全記事合計）
  - ストレージ使用量
- **Google Analytics連携**
  - **アクセス数**
    - 今日のアクセス数
    - 過去7日間のアクセス数推移グラフ
    - 過去30日間のアクセス数推移グラフ
    - 前月比較
  - **人気ページTop10**
    - ページパス
    - ページビュー数
    - 平均滞在時間
  - **検索クエリレポート**
    - Google Search Console連携
    - 流入キーワードTop20
    - クリック数・表示回数・CTR・平均掲載順位
    - 期間指定フィルタ（過去7日/30日/90日）
  - **リアルタイムアクセス**
    - 現在の訪問者数
    - アクティブページ
  - **トラフィックソース**
    - オーガニック検索
    - ソーシャルメディア
    - ダイレクト
    - リファラル
  - **デバイス内訳**
    - デスクトップ / モバイル / タブレット
    - 円グラフで表示
- **最近の活動**
  - 最新の記事5件（タイトル、ステータス、更新日）
  - クイック編集リンク
- **人気記事Top5**（内部DB）
  - 閲覧数順
  - 記事タイトルと閲覧数表示
- **クイックアクション**
  - 新規記事作成ボタン
  - 記事一覧へのリンク
  - カテゴリ管理へのリンク
  - 画像管理へのリンク
- **お知らせエリア**
  - システムアップデート情報
  - メモ機能（簡易的なToDoリスト）

##### ダッシュボードデザイン
- カード形式のレイアウト
- 視認性の高いグラフ・チャート（Recharts使用）
- データの自動更新（1時間ごとにキャッシュ更新）
- ローディング状態の表示
- エラーハンドリング（API接続失敗時の表示）
- レスポンシブ対応
- ダークモード対応（オプション）

##### Analytics API連携仕様
- **Google Analytics Data API (GA4)**
  - サービスアカウント認証
  - 環境変数で認証情報管理
  - レート制限対応
- **Google Search Console API**
  - OAuth 2.0認証またはサービスアカウント
  - 検索パフォーマンスデータ取得
- **データキャッシュ**
  - Redis または Supabase でキャッシュ
  - 更新頻度：1時間ごと
  - APIコール削減でコスト最適化

#### 3.2.3 記事管理
##### 記事作成
- タイトル入力
- カテゴリ選択（複数選択可）
- Tiptapエディタでの本文編集
  - 見出し（H2, H3, H4）
  - 太字・斜体・下線
  - リスト（箇条書き・番号付き）
  - リンク挿入
  - 画像挿入
  - コードブロック（シンタックスハイライト対応）
  - 引用
- サムネイル設定
  - 自動生成（タイトルから）
  - カスタム画像アップロード
- 公開ステータス（下書き / 公開 / 非公開）
- 公開日時設定（予約投稿機能）
- SEO設定
  - メタディスクリプション
  - OGP画像（サムネイルを使用）

##### 記事編集
- 既存記事の編集
- 更新日時の自動記録

##### 記事削除
- 論理削除（復元可能）
- 完全削除

##### 記事一覧
- 全記事リスト表示
- ステータスフィルタリング（下書き / 公開 / 非公開）
- 検索機能
- ソート機能（作成日・更新日・公開日）

#### 3.2.4 カテゴリ管理
- カテゴリの追加・編集・削除
- カテゴリの並び順設定

#### 3.2.5 画像管理
- アップロード済み画像一覧
- 画像削除機能
- ストレージ容量確認

### 3.3 サムネイル自動生成機能

#### 3.3.1 自動生成仕様
- ベース画像にタイトルをオーバーレイ
- デザインテンプレート
  - シンプルで読みやすいレイアウト
  - ブログのトーンに合わせた配色
  - カテゴリごとに色分け（オプション）
- 生成タイミング：記事保存時

#### 3.3.2 カスタムサムネイル
- 手動アップロード機能
- 推奨サイズ：1200×630px（OGP推奨サイズ）
- 対応形式：JPEG、PNG、WebP

---

## 4. 非機能要件

### 4.1 デザイン・UI/UX

#### 4.1.1 デザインコンセプト
- シンプルで読みやすいレイアウト
- 派手すぎない落ち着いたトーン
- 整体・身体性を感じさせる柔らかさ
- 技術ブログとしての信頼性

#### 4.1.2 レスポンシブデザイン
- **デスクトップ**（1024px以上）
  - 2カラムレイアウト（メインコンテンツ + サイドバー）
  - サイドバー：カテゴリ一覧、人気記事、プロフィール
- **タブレット**（768px〜1023px）
  - 1カラムレイアウト
  - サイドバーは下部に配置
- **スマホ**（767px以下）
  - 1カラムレイアウト
  - ハンバーガーメニュー
  - 読みやすい文字サイズ（16px以上）

#### 4.1.3 タイポグラフィ
- 本文：読みやすいゴシック体または明朝体
- 見出し：視認性の高いフォント
- 行間：1.7〜1.8（可読性重視）

#### 4.1.4 カラースキーム
- ベース：白・ライトグレー
- アクセント：落ち着いた色（例：深緑、紺色）
- テキスト：ダークグレー（#333など）
- リンク：視認性の良い色

### 4.2 パフォーマンス
- Lighthouse スコア 90以上を目標
- 画像の最適化（Next.js Image コンポーネント使用）
- コード分割・遅延ロード
- 初期表示速度：3秒以内

### 4.3 SEO対策
- 適切なメタタグ設定
- OGP設定（SNSシェア対応）
- XMLサイトマップ自動生成
- robots.txt設定
- 構造化データ（Schema.org）
- パンくずリスト

### 4.4 アクセシビリティ
- セマンティックHTML
- キーボード操作対応
- 適切なalt属性
- ARIA属性の適切な使用
- コントラスト比の確保

### 4.5 セキュリティ
- Supabase Row Level Security（RLS）設定
- CSRF対策
- XSS対策
- 管理画面への不正アクセス防止
  - 認証必須のミドルウェア実装
  - セッション検証
- **認証ページの保護**
  - `/auth/login`はrobots.txtでDisallow
  - サイトマップから除外
  - 公開ナビゲーションからのリンク無し
  - 直URL入力のみアクセス可能
  - ログイン試行回数制限
- 環境変数による機密情報管理
- HTTPS通信の強制

---

## 5. データベース設計

### 5.1 テーブル構成

#### posts（記事テーブル）
| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY | 記事ID |
| title | TEXT | NOT NULL | タイトル |
| slug | TEXT | UNIQUE, NOT NULL | URLスラッグ |
| content | JSONB | NOT NULL | 本文（Tiptap JSON形式） |
| excerpt | TEXT | | 抜粋 |
| thumbnail_url | TEXT | | サムネイルURL |
| thumbnail_type | TEXT | | auto / custom |
| status | TEXT | NOT NULL | draft / published / private |
| published_at | TIMESTAMPTZ | | 公開日時 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | 更新日時 |
| author_id | UUID | FOREIGN KEY | 著者ID |
| meta_description | TEXT | | メタディスクリプション |
| view_count | INTEGER | DEFAULT 0 | 閲覧数 |

#### categories（カテゴリテーブル）
| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY | カテゴリID |
| name | TEXT | UNIQUE, NOT NULL | カテゴリ名 |
| slug | TEXT | UNIQUE, NOT NULL | URLスラッグ |
| description | TEXT | | 説明 |
| color | TEXT | | カラーコード |
| order | INTEGER | | 表示順 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 作成日時 |

#### post_categories（記事カテゴリ中間テーブル）
| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY | ID |
| post_id | UUID | FOREIGN KEY | 記事ID |
| category_id | UUID | FOREIGN KEY | カテゴリID |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 作成日時 |

### 5.2 インデックス
- posts.slug（UNIQUE INDEX）
- posts.status
- posts.published_at
- categories.slug（UNIQUE INDEX）
- post_categories (post_id, category_id) 複合インデックス

### 5.3 Analyticsキャッシュテーブル

#### analytics_cache（Analytics データキャッシュ）
| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | UUID | PRIMARY KEY | ID |
| cache_key | TEXT | UNIQUE, NOT NULL | キャッシュキー（例：pageviews_7days） |
| data | JSONB | NOT NULL | キャッシュデータ |
| expires_at | TIMESTAMPTZ | NOT NULL | 有効期限 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | 更新日時 |

**用途**
- Google Analytics APIのレスポンスをキャッシュ
- Search Console APIのレスポンスをキャッシュ
- APIコール数削減によるコスト最適化
- ダッシュボードの高速表示

---

## 6. 画面遷移図

```
【公開ページ】
トップページ
├── 記事一覧ページ
│   └── 記事詳細ページ
├── カテゴリページ
│   └── 記事詳細ページ
├── プロフィールページ
└── お問い合わせページ

【管理画面】（認証必須）
/auth/login（直URL入力のみ、一般非公開）
└── 認証成功
    └── /admin/dashboard（ダッシュボード）
        ├── 記事一覧（/admin/posts）
        │   ├── 新規作成（/admin/posts/new）
        │   ├── 編集（/admin/posts/[id]/edit）
        │   └── プレビュー（/admin/posts/[id]/preview）
        ├── カテゴリ管理（/admin/categories）
        └── 画像管理（/admin/media）
```

---

## 7. API設計

### 7.1 公開API

#### 記事取得
- `GET /api/posts` - 記事一覧取得（ページネーション、フィルタリング）
- `GET /api/posts/[slug]` - 記事詳細取得
- `GET /api/posts/category/[slug]` - カテゴリ別記事取得

#### カテゴリ取得
- `GET /api/categories` - カテゴリ一覧取得
- `GET /api/categories/[slug]` - カテゴリ詳細取得

#### 検索
- `GET /api/search?q=[query]` - 記事検索

#### お問い合わせ
- `POST /api/contact` - お問い合わせ送信
  - Zodバリデーションスキーマ
    ```typescript
    {
      name: string (min: 1, max: 100),
      email: string (email format),
      subject: string (min: 1, max: 200),
      message: string (min: 10, max: 2000)
    }
    ```

### 7.2 管理API（認証必須）

#### ダッシュボード
- `GET /api/admin/dashboard/stats` - 統計情報取得
  - 総記事数、カテゴリ数、閲覧数、ストレージ使用量
- `GET /api/admin/dashboard/recent-posts` - 最新記事取得
- `GET /api/admin/dashboard/popular-posts` - 人気記事Top5取得

#### Analytics（Google Analytics / Search Console連携）
- `GET /api/admin/analytics/pageviews` - アクセス数取得
  - クエリパラメータ：period（today / 7days / 30days）
- `GET /api/admin/analytics/popular-pages` - 人気ページTop10
- `GET /api/admin/analytics/realtime` - リアルタイムアクセス数
- `GET /api/admin/analytics/traffic-sources` - トラフィックソース
- `GET /api/admin/analytics/devices` - デバイス内訳
- `GET /api/admin/analytics/search-queries` - 検索クエリレポート
  - クエリパラメータ：period（7days / 30days / 90days）
  - レスポンス：キーワード、クリック数、表示回数、CTR、平均掲載順位

#### 記事管理
- `POST /api/admin/posts` - 記事作成
- `PUT /api/admin/posts/[id]` - 記事更新
- `DELETE /api/admin/posts/[id]` - 記事削除
- `GET /api/admin/posts` - 管理用記事一覧

#### サムネイル生成
- `POST /api/admin/thumbnails/generate` - サムネイル自動生成
- `POST /api/admin/thumbnails/upload` - カスタムサムネイルアップロード

#### カテゴリ管理
- `POST /api/admin/categories` - カテゴリ作成
- `PUT /api/admin/categories/[id]` - カテゴリ更新
- `DELETE /api/admin/categories/[id]` - カテゴリ削除

---

## 8. 開発フェーズ

### Phase 1: 基盤構築（Week 1-2）
- Next.js 16プロジェクト初期設定
- Supabaseセットアップ
- データベース設計・構築
- 認証機能実装
- shadcn/ui導入
- **Google Analytics 4設定**
  - GA4プロパティ作成
  - 測定IDの取得・設定
- **Google Search Console設定**
  - サイト登録
  - 所有権確認

### Phase 2: 公開ページ開発（Week 3-4）
- トップページ実装
- 記事一覧ページ実装
- 記事詳細ページ実装
- カテゴリページ実装
- レスポンシブデザイン実装

### Phase 3: 管理画面開発（Week 5-6）
- 認証ページ実装（ログイン・ログアウト）
- 管理画面レイアウト実装
- **管理者ダッシュボード実装**
  - 統計情報表示
  - グラフ・チャート実装（Recharts）
  - **Google Analytics Data API連携**
  - **Google Search Console API連携**
  - アクセス数・検索クエリレポート表示
  - キャッシュ機構実装
  - クイックアクション
- Tiptapエディタ統合
- 記事CRUD機能実装
- カテゴリ管理機能実装

### Phase 4: サムネイル機能開発（Week 7）
- サムネイル自動生成システム実装
- カスタムサムネイルアップロード機能
- 画像管理機能

### Phase 5: 機能拡張・最適化（Week 8-9）
- 検索機能実装
- SEO最適化
  - メタタグ設定
  - 構造化データ
  - XMLサイトマップ
- パフォーマンス改善
- アクセシビリティ対応
- **Analyticsデータの最適化**
  - キャッシュ戦略の調整
  - レート制限対応
  - エラーハンドリング

### Phase 6: テスト・デプロイ（Week 10）
- 動作テスト
- セキュリティチェック
- 本番環境デプロイ
- ドキュメント整備

---

## 9. 今後の拡張機能（オプション）

### 優先度：中
- コメント機能
- タグ機能（カテゴリとは別の分類）
- 記事のいいね機能
- 関連記事の自動推薦（AI活用）
- RSSフィード
- ニュースレター配信
- Google Analytics連携

### 優先度：低
- 多言語対応
- ダークモード
- 音声読み上げ機能
- PWA対応
- 記事のバージョン管理
- 共同執筆者機能

---

## 10. 運用・保守

### 10.1 定期メンテナンス
- Supabaseバックアップ（自動・週次）
- パッケージ更新（月次）
- セキュリティパッチ適用
- パフォーマンスモニタリング

### 10.2 コンテンツ運用
- 記事投稿頻度：週1〜2回目標
- カテゴリバランスの維持
- 過去記事のリライト・更新

### 10.3 分析・改善
- アクセス解析
- 人気記事の把握
- ユーザー行動分析
- UI/UX改善

---

## 11. 補足事項

### 11.1 認証方式についての考察

**ログインフォーム方式を推奨する理由**

1. **利便性**
   - 外出先からスマホで記事を書く
   - カフェでノートPCから編集
   - 自宅のデスクトップで執筆
   → 複数デバイスでの運用が現実的

2. **セキュリティ**
   - パスワードを変更すれば全デバイスで無効化可能
   - セッションタイムアウトで自動ログアウト
   - 不審なアクセスがあればすぐにパスワード変更で対処

3. **拡張性**
   - 将来、執筆を手伝ってくれる人が現れた場合に対応可能
   - アカウント追加が容易

4. **実装の容易さ**
   - Supabase Authが完全にサポート
   - Next.jsとの統合が簡単
   - セッション管理も自動

**認証ページの保護について**
`/auth/login`は技術的には公開URLですが、以下の方法で実質的に非公開化：
- サイトマップに含めない
- robots.txtでクローラーブロック
- ナビゲーションからリンクしない
- Google等の検索結果に表示されない

この方法なら、URLを知っている本人のみがアクセス可能になります。

### 11.2 初期カテゴリ

プロジェクト開始時のカテゴリ：
1. **日常** - 日々の出来事、気づき
2. **開発** - プログラミング、技術的な話題
3. **経営** - 整体院の経営、ビジネス
4. **読書** - 読んだ本の感想、学び

※カテゴリは管理画面から随時追加・編集可能

### 11.3 参考サイト
- Qiita（サムネイル自動生成の参考）
- はてなブログ（シンプルなレイアウト）
- Zenn（技術ブログのUI/UX）

### 11.4 注意点
- 過度な装飾は避け、読みやすさを最優先
- モバイルファーストで設計
- ページ遷移は高速に
- 管理画面は直感的に操作できるように
- **Analytics API使用時の注意**
  - Google Cloud Consoleでプロジェクト作成必須
  - サービスアカウントの作成と権限設定
  - API有効化（Analytics Data API、Search Console API）
  - レート制限に注意（キャッシュで対応）
  - 認証情報は環境変数で厳重管理

---

## 12. 開発・運用規約

### 12.1 Gitコミット規約

**コミットメッセージフォーマット**
```
<type>: <subject>

<body>（オプション）
```

**Type（接頭辞）**
- `feat:` 新機能追加
- `fix:` バグ修正
- `docs:` ドキュメント変更
- `style:` コードスタイル修正（機能に影響なし）
- `refactor:` リファクタリング
- `perf:` パフォーマンス改善
- `test:` テスト追加・修正
- `chore:` ビルド・ツール関連
- `ci:` CI/CD設定
- `build:` ビルドシステム関連

**例**
```
feat: add Google Analytics integration to dashboard
fix: resolve thumbnail generation error
docs: update README with setup instructions
refactor: optimize database queries for post list
```

**コミットタイミング**
- 機能単位で論理的にまとめる
- 1つのコミットで1つの目的
- 動作確認後にコミット
- 大きな機能は複数コミットに分割

### 12.2 ブランチ戦略
- `main` - 本番環境
- `develop` - 開発環境
- `feature/*` - 機能開発
- `fix/*` - バグ修正

### 12.3 コードレビュー
- 自己レビュー必須
- 大きな変更はプルリクエスト作成

---

**作成日**: 2025年11月21日  
**最終更新**: 2025年11月21日  
**バージョン**: 1.3  
**作成者**: Claude (Anthropic)

**更新履歴**
- v1.3 (2025-11-21)
  - Vercel vs Cloudflareの詳細比較を追加
  - デプロイ戦略と段階的移行計画を追加
  - コスト比較と画像最適化戦略を追加
  - ハイブリッド運用の提案を追加
- v1.2 (2025-11-21)
  - Next.js 16の新機能と設定を追加
  - ディレクトリ構造の推奨事項を追加
  - ファイル管理・クリーンアップのガイドラインを追加
- v1.1 (2025-11-21)
  - Google Analytics / Search Console連携機能を追加
  - ダッシュボードにアクセス解析・検索クエリレポート機能を追加
  - Gitコミット規約を追加
- v1.0 (2025-11-21)
  - 初版作成

---

## 13. Next.js 16 設定・推奨事項

### 13.1 Next.js 16の主な変更点

#### Turbopack（デフォルトバンドラー）
- Next.js 16ではTurbopackがデフォルト
- 2〜5倍速い本番ビルド
- 最大10倍速いFast Refresh
- 設定不要で自動的に有効化

#### ファイルシステムキャッシュ（実験的）
開発環境での起動とコンパイルを高速化：

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
```

#### React 19.2の新機能
- View Transitions（アニメーション）
- `useEffectEvent`（非リアクティブロジック）
- `<Activity>`コンポーネント

#### 非同期パラメータ（重要な変更）
Next.js 16では`params`と`searchParams`が非同期になりました：

```typescript
// ❌ 旧：同期的なアクセス
export default function Page({ params }) {
  const { slug } = params;
}

// ✅ 新：非同期アクセス
export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
}
```

**影響範囲**
- ページコンポーネント
- レイアウトコンポーネント
- Route Handler
- `generateMetadata`関数
- `generateStaticParams`関数

#### 新しいキャッシュAPI

```typescript
// revalidateTag - SWR動作（遅延更新可）
import { revalidateTag } from 'next/cache';
revalidateTag('blog-posts', 'max');

// updateTag - 即座に更新（Server Actionsのみ）
'use server'
import { updateTag } from 'next/cache';
export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile);
  updateTag(`user-${userId}`); // 即座に反映
}
```

### 13.2 プロジェクト構成の推奨事項

#### ディレクトリ構造（コロケーション原則）
依存するファイルは近くに配置する設計：

```
app/
├── (public)/                    # 公開ページグループ
│   ├── _components/            # 公開ページ共通コンポーネント
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── article-card.tsx
│   ├── _lib/                   # 公開ページ用ユーティリティ
│   │   └── format-date.ts
│   ├── page.tsx                # トップページ
│   ├── posts/
│   │   ├── _components/       # 記事ページ専用コンポーネント
│   │   │   ├── post-header.tsx
│   │   │   └── share-buttons.tsx
│   │   ├── page.tsx           # 記事一覧
│   │   └── [slug]/
│   │       └── page.tsx       # 記事詳細
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── contact/
│       ├── _components/       # お問い合わせページ専用
│       │   └── contact-form.tsx
│       └── page.tsx
│
├── admin/                      # 管理画面グループ
│   ├── _components/           # 管理画面共通コンポーネント
│   │   ├── sidebar.tsx
│   │   ├── stat-card.tsx
│   │   └── analytics-chart.tsx
│   ├── _lib/                  # 管理画面用ユーティリティ
│   │   ├── auth.ts
│   │   └── analytics.ts
│   ├── layout.tsx             # 管理画面レイアウト
│   ├── dashboard/
│   │   ├── _components/       # ダッシュボード専用
│   │   │   ├── access-chart.tsx
│   │   │   └── quick-actions.tsx
│   │   └── page.tsx
│   ├── posts/
│   │   ├── _components/       # 記事管理専用
│   │   │   ├── post-list.tsx
│   │   │   └── post-form.tsx
│   │   ├── page.tsx           # 記事一覧
│   │   ├── new/
│   │   │   └── page.tsx       # 新規作成
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx   # 編集
│   ├── categories/
│   │   └── page.tsx
│   └── media/
│       └── page.tsx
│
├── auth/
│   └── login/
│       ├── _components/
│       │   └── login-form.tsx
│       └── page.tsx
│
├── api/                        # API Routes
│   ├── posts/
│   │   └── route.ts
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── stats/
│   │   │       └── route.ts
│   │   └── analytics/
│   │       ├── pageviews/
│   │       │   └── route.ts
│   │       └── search-queries/
│   │           └── route.ts
│   └── contact/
│       └── route.ts
│
├── _components/                # グローバル共通コンポーネント
│   ├── ui/                    # shadcn/uiコンポーネント
│   └── providers/             # Context Providers
│
└── _lib/                      # グローバルユーティリティ
    ├── supabase/
    │   ├── client.ts
    │   └── server.ts
    ├── utils.ts
    └── constants.ts
```

**設計原則**
1. **コロケーション** - 関連ファイルは近くに配置
2. **プライベート接頭辞** - `_`で始まるフォルダはルートにならない
3. **Route Groups** - `()`で論理的にグループ化
4. **階層ごとの分離** - 各階層に専用の`_components`と`_lib`

#### ファイル命名規則
- コンポーネント：kebab-case（例：`article-card.tsx`）
- ユーティリティ：kebab-case（例：`format-date.ts`）
- 型定義：`.types.ts`サフィックス（例：`post.types.ts`）

### 13.3 開発時の注意事項

#### 不要ファイルの削除タイミング
開発中、以下のファイルは不要になった時点で即座に削除：
- モックデータファイル（`.mock.ts`, `mock-data.ts`）
- テスト用SQLファイル（`test.sql`, `sample.sql`）
- 一時的なMarkdownファイル（`notes.md`, `todo.md`）
- 未使用のコンポーネント
- コメントアウトされたコード

**クリーンアップのタイミング**
- 機能実装完了時
- コミット前の確認
- プルリクエスト作成前
- マイルストーン完了時

#### package.jsonスクリプト

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```

Turbopackフラグは不要（デフォルトで有効）

### 13.4 TypeScript設定

```typescript
// next.config.ts（TypeScriptネイティブサポート）
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  // React Compiler（オプション）
  reactCompiler: true,
};

export default nextConfig;
```

### 13.5 非推奨・削除予定の機能
Next.js 16で非推奨となった機能（将来削除予定）：
- 旧middleware規約 → `proxy.ts`へ移行
- `next lint`コマンド → ESLint CLIへ移行
- 同期的な`params`/`searchParams` → 非同期版へ移行

---

## 14. デプロイ戦略：Vercel vs Cloudflare

### 14.1 比較表

| 項目 | Vercel | Cloudflare Pages/Workers |
|-----|--------|--------------------------|
| **Next.js統合** | ★★★★★ ネイティブサポート | ★★★★☆ OpenNext経由で対応 |
| **デプロイの容易さ** | ★★★★★ 最も簡単 | ★★★★☆ 設定が必要 |
| **開発体験（DX）** | ★★★★★ 最高 | ★★★☆☆ 学習曲線あり |
| **価格（小規模）** | ★★★★☆ 無料枠あり | ★★★★★ 非常に安い |
| **価格（大規模）** | ★★☆☆☆ 高額になる | ★★★★★ スケールしても安い |
| **帯域幅制限** | 100GB/月（無料） | ★★★★★ 無制限 |
| **画像最適化** | 有料（$1,000/月から） | 無料〜$5/月 |
| **ビルド速度** | ★★★★★ 最速 | ★★★☆☆ やや遅い |
| **エッジネットワーク** | 24リージョン | ★★★★★ 200+データセンター |
| **レイテンシ** | ★★★★☆ 速い | ★★★★★ 最速 |
| **Node.js互換性** | ★★★★★ 完全 | ★★★☆☆ 一部制限あり |
| **サーバー機能** | ★★★★★ 全機能 | ★★★☆☆ 制限あり |

### 14.2 コスト比較（実例）

#### 月間10万PVのブログの場合

**Vercel（Hobby）**
- 月額：$0
- 帯域幅：100GB含まれる
- 画像最適化：含まれない
- 制限：商用利用不可

**Vercel（Pro）**
- 月額：$20/月
- 帯域幅：1TB含まれる
- 画像最適化：別料金（$1,000/月〜）
- 超過料金：$40/100GB

**Cloudflare Pages**
- 月額：$0（無料プラン）
- 帯域幅：無制限
- 画像最適化：Cloudflare Images $5/月〜
- リクエスト：100,000/日まで無料

#### 月間100万PVの場合

**Vercel Pro**
- 基本料金：$20/月
- 帯域幅超過（想定500GB）：$200〜
- 画像最適化：$1,000/月〜
- **合計：約$1,220/月**

**Cloudflare（Workers Paid）**
- 基本料金：$5/月
- 帯域幅：無制限（$0）
- 画像最適化：$5/月〜
- **合計：約$10〜20/月**

### 14.3 推奨デプロイ戦略

#### 🎯 **推奨：段階的アプローチ**

**フェーズ1：開発・初期リリース（0〜10万PV）**
- **プラットフォーム：Vercel Hobby**
- **理由**：
  - 最高の開発体験
  - ゼロ設定でデプロイ可能
  - プレビューデプロイが完璧
  - 無料で商用利用可能（要確認）
- **制限**：
  - 帯域幅100GB/月まで
  - 商用利用制限の可能性

**フェーズ2：成長期（10万〜50万PV）**
- **プラットフォーム：Cloudflare Pages + Workers**
- **移行タイミング**：
  - 帯域幅が100GBを超え始めた時
  - 画像最適化のコストが気になり始めた時
  - 月間コストが$50を超えそうな時
- **理由**：
  - 帯域幅無制限で安心
  - コスト予測可能
  - スケールしても低コスト

**フェーズ3：拡大期（50万PV以上）**
- **プラットフォーム：Cloudflare Pages + Workers（必須）**
- **理由**：
  - Vercelだと月$1,000以上になる可能性
  - Cloudflareなら月$10〜50程度
  - グローバル配信が最速

### 14.4 ハイブリッド戦略（推奨）

#### 💡 **最適解：両方を使い分ける**

```
開発環境：Vercel
└─ プレビューデプロイ
└─ ブランチごとのテスト環境
└─ 最高のDX

本番環境：Cloudflare
└─ 低コスト運用
└─ 帯域幅無制限
└─ 高速配信
```

**メリット**：
- 開発時はVercelの優れたDXを活用
- 本番はCloudflareのコスト効率を享受
- 最高の体験を低コストで実現

**実装方法**：
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:vercel": "next build",
    "build:cloudflare": "npx @opennextjs/cloudflare",
    "deploy:staging": "vercel --prod",
    "deploy:production": "wrangler pages deploy"
  }
}
```

### 14.5 Cloudflare移行時の注意点

#### ✅ サポートされる機能
- Server Components
- Server Actions
- API Routes
- Image Optimization（Cloudflare Images経由）
- ISR（Incremental Static Regeneration）
- ミドルウェア（制限付き）

#### ⚠️ 制限事項
CloudflareはNode.jsではなくworkerdランタイムを使用するため：
- 一部のNode.js APIが動作しない
- `fs`（ファイルシステム）アクセス不可
- 一部のnpmパッケージが非互換
- `nodejs_compat`フラグが必要

#### 🔧 移行手順（OpenNext使用）

```bash
# 1. OpenNext Cloudflareアダプターをインストール
npm install @opennextjs/cloudflare

# 2. ビルド
npx opennextjs-cloudflare

# 3. ローカルテスト
wrangler pages dev

# 4. デプロイ
wrangler pages deploy
```

**next.config.ts設定例**：
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  // Cloudflare対応
  images: {
    // Cloudflare Imagesを使用
    loader: 'custom',
    loaderFile: './lib/cloudflare-image-loader.ts',
  },
};

export default nextConfig;
```

### 14.6 画像最適化戦略

#### Cloudflare Images設定

```typescript
// lib/cloudflare-image-loader.ts
export default function cloudflareLoader({ 
  src, 
  width, 
  quality 
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(',');
  return `https://your-account.cloudflareimages.com/${src}?${paramsString}`;
}
```

**コスト**：
- 基本料金：$5/月（100,000画像まで）
- 追加：$1/月（10,000画像ごと）
- 配信：無制限・無料

**Vercelとの比較**：
- Vercel：$1,000/月〜（1,000枚画像最適化）
- Cloudflare：$5/月〜（100,000枚まで）

### 14.7 最終推奨事項

#### 🎯 山川さんのブログに最適な戦略

**初期（Phase 1）：Vercelでスタート**
- 開発スピード最優先
- 無料枠で十分
- 最高のDXで効率的に開発

**移行判断基準**：
```
以下のいずれかに該当したらCloudflareへ移行：
✓ 月間帯域幅が80GB超え
✓ Vercelの請求が月$50超え
✓ 画像最適化コストが気になる
✓ 月間10万PV超え
```

**長期運用（Phase 2以降）：Cloudflareへ移行**
- コスト最適化
- 帯域幅無制限の安心感
- 画像最適化も低コスト
- グローバル配信最速

**ハイブリッド運用も検討**：
```
開発・ステージング：Vercel
本番環境：Cloudflare
```

この戦略なら：
- 初期は最速で開発
- 成長しても低コスト
- 最高のパフォーマンス