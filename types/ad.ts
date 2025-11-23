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
