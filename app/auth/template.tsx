export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  // 認証ページではアニメーションを適用しない
  // （親ディレクトリの template.tsx のアニメーションを上書き）
  return <>{children}</>;
}
