export type AdLocation = 'sidebar' | 'article_top' | 'article_bottom'

export interface Ad {
  id: string
  name: string
  ad_slot: string
  location: AdLocation
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdFormData {
  name: string
  ad_slot: string
  location: AdLocation
  is_active: boolean
}

// 新しい広告設定の型定義
export interface AdSettings {
  id: string
  // タイトル下広告
  article_top_pc_slot?: string // PC: 記事内広告
  article_top_mobile_slot?: string // スマホ: スクエア
  // 記事内広告（H2の上）
  in_article_pc_slot?: string // PC: 記事内広告
  in_article_mobile_slot?: string // スマホ: スクエア
  // コンテンツ後広告
  article_bottom_pc_slot_1?: string // PC: スクエア 1つ目
  article_bottom_pc_slot_2?: string // PC: スクエア 2つ目
  article_bottom_mobile_slot?: string // スマホ: スクエア
  // サイドバー広告
  sidebar_pc_slot?: string // PC: 縦長タイプ
  sidebar_mobile_slot?: string // スマホ: スクエア
  updated_at: string
}

export interface AdSettingsFormData {
  article_top_pc_slot?: string
  article_top_mobile_slot?: string
  in_article_pc_slot?: string
  in_article_mobile_slot?: string
  article_bottom_pc_slot_1?: string
  article_bottom_pc_slot_2?: string
  article_bottom_mobile_slot?: string
  sidebar_pc_slot?: string
  sidebar_mobile_slot?: string
}
