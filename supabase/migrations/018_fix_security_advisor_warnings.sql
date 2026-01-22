-- ===========================
-- Fix Supabase Advisor Security Warnings
-- ===========================

-- ===========================
-- 1. Fix increment_post_helpful function search_path
-- ===========================
CREATE OR REPLACE FUNCTION public.increment_post_helpful(
  p_post_id UUID,
  p_session_id VARCHAR(255),
  p_ip_hash VARCHAR(64),
  p_user_agent_hash VARCHAR(64)
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_duplicate_count INTEGER;
  v_new_count INTEGER;
  v_time_threshold TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 過去24時間以内の同一セッション・IPからのリアクションをチェック
  v_time_threshold := NOW() - INTERVAL '24 hours';

  SELECT COUNT(*)
  INTO v_duplicate_count
  FROM public.post_reaction_logs
  WHERE post_id = p_post_id
    AND (
      (session_id = p_session_id AND session_id IS NOT NULL)
      OR (ip_hash = p_ip_hash AND ip_hash IS NOT NULL)
    )
    AND created_at > v_time_threshold;

  -- 重複がある場合はエラーを返す
  IF v_duplicate_count > 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'already_reacted',
      'message', 'You have already reacted to this post'
    );
  END IF;

  -- ログを挿入
  INSERT INTO public.post_reaction_logs (post_id, reaction_type, session_id, ip_hash, user_agent_hash)
  VALUES (p_post_id, 'helpful', p_session_id, p_ip_hash, p_user_agent_hash);

  -- postsテーブルのhelpful_countを更新
  UPDATE public.posts
  SET helpful_count = helpful_count + 1
  WHERE id = p_post_id
  RETURNING helpful_count INTO v_new_count;

  RETURN json_build_object(
    'success', true,
    'count', v_new_count
  );
END;
$$;

-- ===========================
-- 2. Fix analytics_cache RLS policy
-- ===========================
DROP POLICY IF EXISTS "Only authenticated users can access analytics cache" ON public.analytics_cache;

-- 分離されたポリシーに置き換え（SELECTは許可、INSERT/UPDATE/DELETEはauth.uid()チェック）
CREATE POLICY "Authenticated users can read analytics cache"
  ON public.analytics_cache FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert analytics cache"
  ON public.analytics_cache FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update analytics cache"
  ON public.analytics_cache FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete analytics cache"
  ON public.analytics_cache FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ===========================
-- 3. Fix post_reaction_logs INSERT policy
-- ===========================
DROP POLICY IF EXISTS "Anyone can insert post_reaction_logs" ON public.post_reaction_logs;

-- post_idが存在することをチェック（存在しないpost_idへの挿入を防止）
CREATE POLICY "Anyone can insert post_reaction_logs"
  ON public.post_reaction_logs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE id = post_id AND status = 'published'
    )
  );

-- ===========================
-- 4. Fix posts INSERT policy
-- ===========================
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;

CREATE POLICY "Authenticated users can create posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

-- ===========================
-- 5. Fix posts UPDATE policy
-- ===========================
DROP POLICY IF EXISTS "Authenticated users can update posts" ON public.posts;

CREATE POLICY "Authenticated users can update posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- ===========================
-- 6. Fix posts DELETE policy
-- ===========================
DROP POLICY IF EXISTS "Authenticated users can delete posts" ON public.posts;

CREATE POLICY "Authenticated users can delete posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());
