import { createClient } from '@/lib/supabase/server'
import type { AdSettings, AdSettingsFormData } from '@/types/ad'

/**
 * 広告設定を取得
 */
export async function getAdSettings(): Promise<AdSettings | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ad_settings')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // データがない場合はnullを返す
      return null
    }
    console.error('Error fetching ad settings:', error)
    return null
  }

  return data
}

/**
 * 広告設定を更新または作成
 */
export async function upsertAdSettings(
  data: AdSettingsFormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // 既存の設定を確認
  const { data: existing } = await supabase
    .from('ad_settings')
    .select('id')
    .limit(1)
    .single()

  if (existing) {
    // 更新
    const { error } = await supabase
      .from('ad_settings')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', existing.id)

    if (error) {
      console.error('Error updating ad settings:', error)
      return { success: false, error: error.message }
    }
  } else {
    // 新規作成
    const { error } = await supabase
      .from('ad_settings')
      .insert([{ ...data, updated_at: new Date().toISOString() }])

    if (error) {
      console.error('Error creating ad settings:', error)
      return { success: false, error: error.message }
    }
  }

  return { success: true }
}
