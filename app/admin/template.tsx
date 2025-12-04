export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  // 管理画面ではアニメーションを適用しない
  return <>{children}</>
}
