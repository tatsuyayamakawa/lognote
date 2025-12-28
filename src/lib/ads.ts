import { createClient } from '@/lib/supabase/server'
import type { Ad, AdFormData, AdLocation } from '@/types/ad'

/**
 * 特定のロケーションの有効な広告を取得
 */
export async function getAdsByLocation(location: AdLocation): Promise<Ad | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('location', location)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // エラーがある場合でも、以下の場合は無視
  // - PGRST116: 結果が見つからない（データなし）
  // - テーブルが存在しない、または権限がない場合
  if (error) {
    // テーブルが存在しない場合や権限エラーの場合のみログ出力
    if (error.code && error.code !== 'PGRST116') {
      if (error.code === '42P01' || error.code === '42501') {
        console.error('Error fetching ads (table missing or permission denied):', error.message)
      }
    }
    // データがないか、テーブルが存在しない場合はnullを返す
    return null
  }

  return data
}

/**
 * 全ての広告を取得（管理画面用）
 */
export async function getAllAds(): Promise<Ad[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .order('created_at', { ascending: false })

  // テーブルが存在しない、またはデータがない場合のエラーを無視
  if (error && error.code !== 'PGRST116') {
    // PGRST116: 結果が見つからない
    // テーブルが存在しない場合や権限エラーの場合のみログ出力
    if (error.code === '42P01' || error.code === '42501') {
      console.error('Error fetching all ads (table missing or permission denied):', error.message)
    }
    return []
  }

  return data || []
}

/**
 * 広告を作成
 */
export async function createAd(adData: AdFormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('ads')
    .insert([adData])

  if (error) {
    console.error('Error creating ad:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * 広告を更新
 */
export async function updateAd(id: string, adData: Partial<AdFormData>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('ads')
    .update(adData)
    .eq('id', id)

  if (error) {
    console.error('Error updating ad:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * 広告を削除
 */
export async function deleteAd(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('ads')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting ad:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
