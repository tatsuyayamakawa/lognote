import { createClient } from "@/lib/supabase/server";
import {
  createClient as createBrowserClient,
  SupabaseClient,
} from "@supabase/supabase-js";
import {
  Post,
  Category,
  PostWithCategories,
  type Database,
  type AnalyticsCacheInsert,
} from "@/types";

// Supabaseのクエリ結果の型定義
type PostWithPostCategories = Post & {
  post_categories: Array<{
    category: Category;
  }>;
};

type PostWithRelatedCategories = Post & {
  categories: Array<{
    category: Category;
  }>;
};

// Supabaseクライアント型
type SupabaseClientType = SupabaseClient<Database>;

/**
 * 静的生成用のSupabaseクライアント（認証不要）
 */
function createStaticClient() {
  // ビルド時に環境変数がない場合のフォールバック
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * 公開済み記事を取得（カテゴリ情報も含む）
 */
export async function getPublishedPosts(
  limit?: number
): Promise<PostWithCategories[]> {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      thumbnail_url,
      og_image_url,
      published_at,
      created_at,
      updated_at,
      view_count,
      helpful_count,
      is_featured,
      status,
      post_categories!inner (
        category:categories (*)
      )
    `
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  // データを整形
  return (data || []).map(
    (post: any): PostWithCategories => ({
      ...post,
      categories:
        post.post_categories?.map((pc: any) => pc.category).filter(Boolean) || [],
    })
  );
}

/**
 * 公開済み記事をページネーション付きで取得
 */
export async function getPublishedPostsWithPagination(
  page: number = 1,
  perPage: number = 12
): Promise<{ posts: PostWithCategories[]; totalPages: number }> {
  const supabase = await createClient();

  // 総記事数を取得
  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const totalPages = Math.ceil((count || 0) / perPage);

  // ページネーション付きで記事を取得
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      post_categories!inner (
        category:categories (*)
      )
    `
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching posts with pagination:", error);
    return { posts: [], totalPages: 0 };
  }

  const posts = (data || []).map(
    (post: PostWithPostCategories): PostWithCategories => ({
      ...post,
      categories:
        post.post_categories?.map((pc) => pc.category).filter(Boolean) || [],
    })
  );

  return { posts, totalPages };
}

/**
 * 特集記事を取得（is_featured = true）
 */
export async function getFeaturedPosts(
  limit?: number
): Promise<PostWithCategories[]> {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      thumbnail_url,
      og_image_url,
      published_at,
      created_at,
      updated_at,
      view_count,
      helpful_count,
      is_featured,
      status,
      post_categories!inner (
        category:categories (*)
      )
    `
    )
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }

  // データを整形
  return (data || []).map(
    (post: any): PostWithCategories => ({
      ...post,
      categories:
        post.post_categories?.map((pc: any) => pc.category).filter(Boolean) || [],
    })
  );
}

/**
 * スラッグから記事を取得
 */
export async function getPostBySlug(
  slug: string
): Promise<PostWithCategories | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      post_categories (
        category:categories (*)
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    categories:
      data.post_categories
        ?.map((pc: { category: Category }) => pc.category)
        .filter(Boolean) || [],
  };
}

/**
 * カテゴリ別の記事を取得
 */
export async function getPostsByCategory(
  categorySlug: string
): Promise<PostWithCategories[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      post_categories!inner (
        category:categories!inner (*)
      )
    `
    )
    .eq("status", "published")
    .eq("post_categories.category.slug", categorySlug)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }

  return (data || []).map(
    (post: PostWithPostCategories): PostWithCategories => ({
      ...post,
      categories:
        post.post_categories?.map((pc) => pc.category).filter(Boolean) || [],
    })
  );
}

/**
 * カテゴリ別の記事をページネーション付きで取得
 */
export async function getPostsByCategoryWithPagination(
  categorySlug: string,
  page: number = 1,
  perPage: number = 12
): Promise<{ posts: PostWithCategories[]; totalPages: number }> {
  const supabase = await createClient();

  // 総記事数を取得
  const { count } = await supabase
    .from("posts")
    .select("*, post_categories!inner(category:categories!inner(*))", { count: "exact", head: true })
    .eq("status", "published")
    .eq("post_categories.category.slug", categorySlug);

  const totalPages = Math.ceil((count || 0) / perPage);

  // ページネーション付きで記事を取得
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      post_categories!inner (
        category:categories!inner (*)
      )
    `
    )
    .eq("status", "published")
    .eq("post_categories.category.slug", categorySlug)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching posts by category with pagination:", error);
    return { posts: [], totalPages: 0 };
  }

  const posts = (data || []).map(
    (post: PostWithPostCategories): PostWithCategories => ({
      ...post,
      categories:
        post.post_categories?.map((pc) => pc.category).filter(Boolean) || [],
    })
  );

  return { posts, totalPages };
}

/**
 * 全カテゴリを取得
 */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

/**
 * スラッグからカテゴリを取得
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * 静的生成用：公開済み記事のスラッグ一覧を取得
 */
export async function getPublishedPostSlugs(): Promise<string[]> {
  const supabase = createStaticClient();

  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");

  if (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }

  return (data || []).map((post) => post.slug);
}

/**
 * 静的生成用：カテゴリのスラッグ一覧を取得
 */
export async function getCategorySlugs(): Promise<string[]> {
  const supabase = createStaticClient();

  const { data, error } = await supabase.from("categories").select("slug");

  if (error) {
    console.error("Error fetching category slugs:", error);
    return [];
  }

  return (data || []).map((category) => category.slug);
}

/**
 * 関連記事を取得（同じカテゴリの記事）
 */
export async function getRelatedPosts(
  postId: string,
  categoryIds: string[],
  limit: number = 3
): Promise<PostWithCategories[]> {
  const supabase = await createClient();

  if (categoryIds.length === 0) {
    return [];
  }

  // 同じカテゴリの記事を取得（現在の記事を除く）
  const { data: relatedPostIds } = await supabase
    .from("post_categories")
    .select("post_id")
    .in("category_id", categoryIds)
    .neq("post_id", postId);

  if (!relatedPostIds || relatedPostIds.length === 0) {
    return [];
  }

  // 重複を削除
  const uniquePostIds = [
    ...new Set(relatedPostIds.map((item) => item.post_id)),
  ];

  // 記事の詳細を取得
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      thumbnail_url,
      og_image_url,
      published_at,
      created_at,
      updated_at,
      view_count,
      helpful_count,
      is_featured,
      status,
      categories:post_categories(category:categories(*))
    `
    )
    .in("id", uniquePostIds)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (!posts) {
    return [];
  }

  // カテゴリデータを整形
  return posts.map(
    (post: any): PostWithCategories => ({
      ...post,
      categories:
        post.categories
          ?.map((pc: { category: Category }) => pc.category)
          .filter(Boolean) || [],
    })
  );
}

/**
 * Google Analyticsの閲覧数をデータベースに同期（キャッシュ付き）
 * @param forceRefresh キャッシュを無視して強制的に同期する
 */
export async function syncViewCountsFromAnalytics(
  forceRefresh: boolean = false
) {
  const supabase = await createClient();
  const CACHE_KEY = "view_counts_sync";
  const CACHE_DURATION_HOURS = 1; // 1時間キャッシュ

  // キャッシュをチェック（強制更新でない場合）
  if (!forceRefresh) {
    const { data: cache } = await supabase
      .from("analytics_cache")
      .select("*")
      .eq("cache_key", CACHE_KEY)
      .single();

    if (cache) {
      const expiresAt = new Date(cache.expires_at);
      const now = new Date();

      if (expiresAt > now) {
        return cache.data as { updated: number; errors: number; skipped?: number };
      }
    }
  }

  // Google Analyticsから記事ごとの閲覧数を取得
  const { getPostViewCounts } = await import(
    "@/lib/google-analytics/analytics"
  );
  const viewCounts = await getPostViewCounts();

  if (viewCounts.length === 0) {
    const result = { updated: 0, errors: 0, skipped: 0 };
    await saveSyncResultToCache(
      supabase,
      CACHE_KEY,
      result,
      CACHE_DURATION_HOURS
    );
    return result;
  }

  let updated = 0;
  let errors = 0;
  let skipped = 0;

  // データベース内の全記事を取得（view_count も含む）
  const { data: posts } = await supabase.from("posts").select("id, slug, view_count");

  if (!posts) {
    console.error("[Posts] Failed to fetch posts from database");
    return { updated: 0, errors: 1 };
  }

  // スラッグをキーにしたマップを作成（view_count も保持）
  const postsBySlug = new Map(
    posts.map((post) => [post.slug, { id: post.id, currentViewCount: post.view_count || 0 }])
  );

  // 閲覧数を更新
  for (const { slug, views } of viewCounts) {
    const post = postsBySlug.get(slug);

    if (!post) {
      // スラッグに対応する記事が見つからない場合はスキップ
      continue;
    }

    // view_count が変更されない場合は UPDATE をスキップ
    if (post.currentViewCount === views) {
      skipped++;
      continue;
    }

    // view_count のみを更新
    // データベーストリガーが view_count のみの変更時は updated_at を更新しない
    const { error } = await supabase
      .from("posts")
      .update({
        view_count: views,
      })
      .eq("id", post.id);

    if (error) {
      console.error(
        `[Posts] Failed to update view count for slug: ${slug}`,
        error
      );
      errors++;
    } else {
      updated++;
    }
  }

  const result = { updated, errors, skipped };

  // 結果をキャッシュに保存
  await saveSyncResultToCache(
    supabase,
    CACHE_KEY,
    result,
    CACHE_DURATION_HOURS
  );

  return result;
}

/**
 * 同期結果をキャッシュに保存
 */
async function saveSyncResultToCache(
  supabase: SupabaseClientType,
  cacheKey: string,
  data: Record<string, number>,
  hours: number
) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + hours * 60 * 60 * 1000);

  try {
    // 既存のキャッシュを削除
    await supabase.from("analytics_cache").delete().eq("cache_key", cacheKey);

    // 新しいキャッシュを挿入
    const insertData: AnalyticsCacheInsert = {
      cache_key: cacheKey,
      data: data as AnalyticsCacheInsert["data"],
      expires_at: expiresAt.toISOString(),
    };
    const cacheTable = supabase.from("analytics_cache");
    const result = await (
      cacheTable as unknown as {
        insert: (values: AnalyticsCacheInsert) => Promise<{
          error: {
            message: string;
            details?: string;
            hint?: string;
            code?: string;
          } | null;
        }>;
      }
    ).insert(insertData);

    if (result.error) {
      console.error("[Posts] Failed to save cache:", {
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint,
        code: result.error.code,
      });
    }
  } catch (err) {
    // analytics_cacheテーブルが存在しない場合などはスキップ
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.warn("[Posts] Cache save skipped:", errorMessage);
  }
}
