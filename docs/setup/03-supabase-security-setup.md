# Supabase セキュリティ設定ガイド

このドキュメントでは、Supabaseのセキュリティアドバイザーで検出された警告への対応方法を説明します。

## 1. データベース関数のsearch_pathセキュリティ修正 ✅

マイグレーションファイル `004_fix_function_security.sql` で自動的に修正されます。

マイグレーションを適用するには:

```bash
# ローカル開発環境
supabase db reset

# または、本番環境へのマイグレーション適用
supabase db push
```

## 2. 漏洩パスワード保護の有効化 ⚠️ Pro Plan限定機能

> **重要**: この機能は**Supabase Pro Plan以上**でのみ利用可能です。
> Free Planをお使いの場合、この警告は無視して問題ありません。

Supabase Authは、HaveIBeenPwned.orgと連携して、漏洩したパスワードの使用を防ぐことができます。

### Free Planでの代替セキュリティ対策:

Pro Planにアップグレードできない場合、以下の対策を実装することを推奨します:

1. **パスワードポリシーの強化**
   - 最低文字数: 12文字以上
   - 大文字・小文字・数字・記号の組み合わせを推奨
   - ユーザーにパスワードマネージャーの使用を推奨

2. **多要素認証 (MFA) の実装**
   ```typescript
   // Supabase MFAは全プランで利用可能
   const { data, error } = await supabase.auth.mfa.enroll({
     factorType: 'totp'
   });
   ```

3. **アカウントセキュリティの教育**
   - ユーザーに強力なパスワードの重要性を説明
   - 定期的なパスワード変更を推奨（任意）

### Pro Planの場合の設定手順:

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com/dashboard にログイン
   - プロジェクトを選択

2. **認証設定を開く**
   - 左サイドバーから「Authentication」を選択
   - 「Policies」または「Settings」タブをクリック

3. **漏洩パスワード保護を有効化**
   - 「Password Protection」セクションを探す
   - 「Enable leaked password protection」をONにする
   - または「Password policies」で「Check against HaveIBeenPwned」を有効化

4. **設定を保存**

### この機能について:

- ユーザーが新しいパスワードを設定する際、HaveIBeenPwned.orgのデータベースと照合します
- 漏洩が確認されたパスワードの使用を防ぎます
- プライバシーは保護されます（パスワードは平文で送信されません）
- セキュリティが大幅に向上します

### 注意事項:

- この設定はSupabaseダッシュボードでのみ変更可能です
- マイグレーションファイルでは設定できません
- 既存のパスワードには影響しません（次回パスワード変更時にチェックされます）
- **Free Planでは利用不可**

## セキュリティチェックリスト

### 全プラン共通（必須）
- [x] 関数のsearch_path脆弱性を修正
- [x] Row Level Security (RLS) を全テーブルで有効化済み
- [x] 適切なRLSポリシーを設定済み
- [ ] 管理者アカウントに強力なパスワードを設定
- [ ] 環境変数（.env.local）をGitにコミットしない

### Pro Plan以上のみ（オプション）
- [ ] 漏洩パスワード保護を有効化（ダッシュボードで手動設定、月額$25〜）

**注意**: Free Planでは漏洩パスワード保護は利用できませんが、上記の「全プラン共通」のセキュリティ対策を実施することで、十分なセキュリティレベルを確保できます。

## 参考リンク

- [Supabase Security Best Practices](https://supabase.com/docs/guides/database/postgres/security)
- [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3)
