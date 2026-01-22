-- 記事のhelpful_countカラムを追加（高速表示用）
ALTER TABLE posts ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;

-- 記事リアクションの詳細ログテーブルを作成（分析・不正防止用）
CREATE TABLE IF NOT EXISTS post_reaction_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) NOT NULL DEFAULT 'helpful',
  session_id VARCHAR(255),
  ip_hash VARCHAR(64),
  user_agent_hash VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_post_reaction_logs_post_id ON post_reaction_logs(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reaction_logs_session ON post_reaction_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_post_reaction_logs_created_at ON post_reaction_logs(created_at);

-- 同一セッション・IPからの重複チェック用の複合インデックス
CREATE INDEX IF NOT EXISTS idx_post_reaction_logs_duplicate_check
  ON post_reaction_logs(post_id, session_id, ip_hash, created_at DESC);

-- RLSポリシーの設定（誰でも読み取り可能、挿入は認証済みユーザーまたは匿名可能）
ALTER TABLE post_reaction_logs ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能
CREATE POLICY "Anyone can read post_reaction_logs"
  ON post_reaction_logs
  FOR SELECT
  USING (true);

-- 誰でも挿入可能（API Routeでバリデーション）
CREATE POLICY "Anyone can insert post_reaction_logs"
  ON post_reaction_logs
  FOR INSERT
  WITH CHECK (true);

-- リアクション追加用のストアドプロシージャ
CREATE OR REPLACE FUNCTION increment_post_helpful(
  p_post_id UUID,
  p_session_id VARCHAR(255),
  p_ip_hash VARCHAR(64),
  p_user_agent_hash VARCHAR(64)
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
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
  FROM post_reaction_logs
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
  INSERT INTO post_reaction_logs (post_id, reaction_type, session_id, ip_hash, user_agent_hash)
  VALUES (p_post_id, 'helpful', p_session_id, p_ip_hash, p_user_agent_hash);

  -- postsテーブルのhelpful_countを更新
  UPDATE posts
  SET helpful_count = helpful_count + 1
  WHERE id = p_post_id
  RETURNING helpful_count INTO v_new_count;

  RETURN json_build_object(
    'success', true,
    'count', v_new_count
  );
END;
$$;

-- 既存の記事のhelpful_countを0で初期化（すでにデータがある場合）
UPDATE posts SET helpful_count = 0 WHERE helpful_count IS NULL;
