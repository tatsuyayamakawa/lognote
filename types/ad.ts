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
  article_top_mobile_slot?: string // スマホ: ディスプレイ
  // 記事内広告（H2の上）- 位置1〜5
  in_article_pc_slot_1?: string // PC: 記事内広告（2つ目のH2前）
  in_article_mobile_slot_1?: string // スマホ: 記事内広告（2つ目のH2前）
  in_article_pc_slot_2?: string // PC: 記事内広告（3つ目のH2前）
  in_article_mobile_slot_2?: string // スマホ: 記事内広告（3つ目のH2前）
  in_article_pc_slot_3?: string // PC: 記事内広告（4つ目のH2前）
  in_article_mobile_slot_3?: string // スマホ: 記事内広告（4つ目のH2前）
  in_article_pc_slot_4?: string // PC: 記事内広告（5つ目のH2前）
  in_article_mobile_slot_4?: string // スマホ: 記事内広告（5つ目のH2前）
  in_article_pc_slot_5?: string // PC: 記事内広告（6つ目のH2前）
  in_article_mobile_slot_5?: string // スマホ: 記事内広告（6つ目のH2前）
  // コンテンツ後広告
  article_bottom_pc_slot?: string // PC: 記事内広告
  article_bottom_mobile_slot?: string // スマホ: ディスプレイ
  // サイドバー広告
  sidebar_pc_slot?: string // PC: ディスプレイ
  sidebar_mobile_slot?: string // スマホ: ディスプレイ
  updated_at: string
}

export interface AdSettingsFormData {
  article_top_pc_slot?: string
  article_top_mobile_slot?: string
  in_article_pc_slot_1?: string
  in_article_mobile_slot_1?: string
  in_article_pc_slot_2?: string
  in_article_mobile_slot_2?: string
  in_article_pc_slot_3?: string
  in_article_mobile_slot_3?: string
  in_article_pc_slot_4?: string
  in_article_mobile_slot_4?: string
  in_article_pc_slot_5?: string
  in_article_mobile_slot_5?: string
  article_bottom_pc_slot?: string
  article_bottom_mobile_slot?: string
  sidebar_pc_slot?: string
  sidebar_mobile_slot?: string
}
