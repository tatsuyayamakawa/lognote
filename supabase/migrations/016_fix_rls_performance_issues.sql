-- Fix RLS performance issues by optimizing auth function calls and consolidating policies

-- ====================================
-- 1. Fix ad_settings RLS policies
-- ====================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read ad settings" ON ad_settings;
DROP POLICY IF EXISTS "Authenticated users can update ad settings" ON ad_settings;

-- Create optimized consolidated policy for SELECT
CREATE POLICY "ad_settings_select_policy" ON ad_settings
  FOR SELECT
  USING (true);

-- Create optimized policy for UPDATE with subquery
CREATE POLICY "ad_settings_update_policy" ON ad_settings
  FOR UPDATE
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- ====================================
-- 2. Fix google_adsense_tokens RLS policies
-- ====================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own AdSense tokens" ON google_adsense_tokens;
DROP POLICY IF EXISTS "Users can insert their own AdSense tokens" ON google_adsense_tokens;
DROP POLICY IF EXISTS "Users can update their own AdSense tokens" ON google_adsense_tokens;
DROP POLICY IF EXISTS "Users can delete their own AdSense tokens" ON google_adsense_tokens;

-- Create optimized policies with subquery
CREATE POLICY "google_adsense_tokens_select_policy" ON google_adsense_tokens
  FOR SELECT
  USING (user_id = (select auth.uid()));

CREATE POLICY "google_adsense_tokens_insert_policy" ON google_adsense_tokens
  FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "google_adsense_tokens_update_policy" ON google_adsense_tokens
  FOR UPDATE
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "google_adsense_tokens_delete_policy" ON google_adsense_tokens
  FOR DELETE
  USING (user_id = (select auth.uid()));

-- ====================================
-- 3. Fix categories RLS policies
-- ====================================

-- Drop existing policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;

-- Create optimized consolidated policy for SELECT
CREATE POLICY "categories_select_policy" ON categories
  FOR SELECT
  USING (true);

-- Create optimized policy for INSERT
CREATE POLICY "categories_insert_policy" ON categories
  FOR INSERT
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Create optimized policy for UPDATE
CREATE POLICY "categories_update_policy" ON categories
  FOR UPDATE
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Create optimized policy for DELETE
CREATE POLICY "categories_delete_policy" ON categories
  FOR DELETE
  USING ((select auth.uid()) IS NOT NULL);

-- ====================================
-- 4. Fix post_categories RLS policies
-- ====================================

-- Drop existing policies
DROP POLICY IF EXISTS "Post categories are viewable by everyone" ON post_categories;
DROP POLICY IF EXISTS "Authenticated users can manage post categories" ON post_categories;

-- Create optimized consolidated policy for SELECT
CREATE POLICY "post_categories_select_policy" ON post_categories
  FOR SELECT
  USING (true);

-- Create optimized policy for INSERT
CREATE POLICY "post_categories_insert_policy" ON post_categories
  FOR INSERT
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Create optimized policy for UPDATE
CREATE POLICY "post_categories_update_policy" ON post_categories
  FOR UPDATE
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Create optimized policy for DELETE
CREATE POLICY "post_categories_delete_policy" ON post_categories
  FOR DELETE
  USING ((select auth.uid()) IS NOT NULL);

-- ====================================
-- 5. Fix posts RLS policies
-- ====================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON posts;

-- Create optimized consolidated policy for SELECT
-- Allow everyone to view published posts, authenticated users can view all posts
CREATE POLICY "posts_select_policy" ON posts
  FOR SELECT
  USING (
    status = 'published'
    OR (select auth.uid()) IS NOT NULL
  );

-- Note: Keep other posts policies (INSERT, UPDATE, DELETE) as they are if they exist

-- ====================================
-- 6. Remove unused indexes
-- ====================================

-- Drop unused index on posts.author_id if it exists
-- Note: Only drop if you're certain it's not needed for foreign key constraints
-- DROP INDEX IF EXISTS idx_posts_author_id;

-- Drop unused index on analytics_cache.expires_at if it exists
DROP INDEX IF EXISTS idx_analytics_cache_expires_at;
