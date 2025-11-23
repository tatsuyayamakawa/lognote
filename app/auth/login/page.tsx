import { LoginForm } from "./login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ログイン | 整えて、創る。",
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">管理者ログイン</h1>
          <p className="text-muted-foreground">
            整えて、創る。管理画面
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
