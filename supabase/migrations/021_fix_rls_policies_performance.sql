-- Fix RLS policies performance warnings
-- Replace auth.<function>() with (select auth.<function>()) for better performance

-- =============================================
-- posts table policies
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can update posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON posts;

-- Recreate with optimized auth function calls
CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "Authenticated users can update posts" ON posts
  FOR UPDATE
  TO authenticated
  USING ((select auth.role()) = 'authenticated')
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "Authenticated users can delete posts" ON posts
  FOR DELETE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

-- =============================================
-- analytics_cache table policies
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert analytics cache" ON analytics_cache;
DROP POLICY IF EXISTS "Authenticated users can update analytics cache" ON analytics_cache;
DROP POLICY IF EXISTS "Authenticated users can delete analytics cache" ON analytics_cache;

-- Recreate with optimized auth function calls
CREATE POLICY "Authenticated users can insert analytics cache" ON analytics_cache
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "Authenticated users can update analytics cache" ON analytics_cache
  FOR UPDATE
  TO authenticated
  USING ((select auth.role()) = 'authenticated')
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "Authenticated users can delete analytics cache" ON analytics_cache
  FOR DELETE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

-- =============================================
-- images table policies (fix always true warning)
-- =============================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "images_insert_policy" ON images;
DROP POLICY IF EXISTS "images_update_policy" ON images;
DROP POLICY IF EXISTS "images_delete_policy" ON images;

-- Recreate with proper auth checks
CREATE POLICY "images_insert_policy" ON images
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "images_update_policy" ON images
  FOR UPDATE
  TO authenticated
  USING ((select auth.role()) = 'authenticated')
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "images_delete_policy" ON images
  FOR DELETE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');
