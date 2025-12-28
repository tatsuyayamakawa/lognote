import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // ビルド時に環境変数がない場合のフォールバック
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
