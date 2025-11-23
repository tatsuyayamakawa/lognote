import { createClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@supabase/supabase-js'
import { Post, Category, PostWithCategories } from '@/types'

/**
 * 静的生成用のSupabaseクライアント（認証不要）
 */
function createStaticClient() {
  // ビルド時に環境変数がない場合のフォールバック
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}

/**
 * 公開済み記事を取得（カテゴリ情報も含む）
 */
export async function getPublishedPosts(limit?: number): Promise<PostWithCategories[]> {
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select(
      `
      *,
      post_categories!inner (
        category:categories (*)
      )
    `
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  // データを整形
  return (data || []).map((post: any) => ({
    ...post,
    categories: post.post_categories?.map((pc: any) => pc.category).filter(Boolean) || [],
  }))
}

/**
 * 特集記事を取得（is_featured = true）
 */
export async function getFeaturedPosts(limit?: number): Promise<PostWithCategories[]> {
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select(
      `
      *,
      post_categories!inner (
        category:categories (*)
      )
    `
    )
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }

  // データを整形
  return (data || []).map((post: any) => ({
    ...post,
    categories: post.post_categories?.map((pc: any) => pc.category).filter(Boolean) || [],
  }))
}

/**
 * スラッグから記事を取得
 */
export async function getPostBySlug(slug: string): Promise<PostWithCategories | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      post_categories (
        category:categories (*)
      )
    `
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    return null
  }

  return {
    ...data,
    categories: data.post_categories?.map((pc: any) => pc.category).filter(Boolean) || [],
  }
}

/**
 * カテゴリ別の記事を取得
 */
export async function getPostsByCategory(categorySlug: string): Promise<PostWithCategories[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      post_categories!inner (
        category:categories!inner (*)
      )
    `
    )
    .eq('status', 'published')
    .eq('post_categories.category.slug', categorySlug)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }

  return (data || []).map((post: any) => ({
    ...post,
    categories: post.post_categories?.map((pc: any) => pc.category).filter(Boolean) || [],
  }))
}

/**
 * 全カテゴリを取得
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

/**
 * スラッグからカテゴリを取得
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * 静的生成用：公開済み記事のスラッグ一覧を取得
 */
export async function getPublishedPostSlugs(): Promise<string[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published')

  if (error) {
    console.error('Error fetching post slugs:', error)
    return []
  }

  return (data || []).map((post) => post.slug)
}

/**
 * 静的生成用：カテゴリのスラッグ一覧を取得
 */
export async function getCategorySlugs(): Promise<string[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase.from('categories').select('slug')

  if (error) {
    console.error('Error fetching category slugs:', error)
    return []
  }

  return (data || []).map((category) => category.slug)
}

/**
 * 関連記事を取得（同じカテゴリの記事）
 */
export async function getRelatedPosts(
  postId: string,
  categoryIds: string[],
  limit: number = 3
): Promise<PostWithCategories[]> {
  const supabase = await createClient()

  if (categoryIds.length === 0) {
    return []
  }

  // 同じカテゴリの記事を取得（現在の記事を除く）
  const { data: relatedPostIds } = await supabase
    .from('post_categories')
    .select('post_id')
    .in('category_id', categoryIds)
    .neq('post_id', postId)

  if (!relatedPostIds || relatedPostIds.length === 0) {
    return []
  }

  // 重複を削除
  const uniquePostIds = [...new Set(relatedPostIds.map((item) => item.post_id))]

  // 記事の詳細を取得
  const { data: posts } = await supabase
    .from('posts')
    .select(
      `
      *,
      categories:post_categories(category:categories(*))
    `
    )
    .in('id', uniquePostIds)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (!posts) {
    return []
  }

  // カテゴリデータを整形
  return posts.map((post) => ({
    ...post,
    categories: post.categories?.map((pc: any) => pc.category).filter(Boolean) || [],
  }))
}
