import { Database } from './database.types'

// Database Types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

// Post Types
export type Post = Tables<'posts'>
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']
export type PostStatus = 'draft' | 'published' | 'private'
export type ThumbnailType = 'auto' | 'custom'

// Category Types
export type Category = Tables<'categories'>
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

// Post with Categories
export type PostWithCategories = Post & {
  categories: Category[]
}

// Analytics Cache Types
export type AnalyticsCache = Tables<'analytics_cache'>
export type AnalyticsCacheInsert = Database['public']['Tables']['analytics_cache']['Insert']
export type AnalyticsCacheUpdate = Database['public']['Tables']['analytics_cache']['Update']

// Ad Types
export * from './ad'
