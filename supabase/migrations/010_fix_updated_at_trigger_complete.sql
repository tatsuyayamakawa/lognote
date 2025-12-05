-- ===========================
-- Updated At Trigger Function (Complete Fix)
-- view_count のみが更新された場合は updated_at を更新しない
-- すべてのカラムをチェックするように修正
-- ===========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- view_count のみが変更された場合は updated_at を更新しない
  -- 他のすべてのカラムが同じかチェック
  IF (OLD.view_count IS DISTINCT FROM NEW.view_count) AND
     (OLD.title IS NOT DISTINCT FROM NEW.title) AND
     (OLD.slug IS NOT DISTINCT FROM NEW.slug) AND
     (OLD.content IS NOT DISTINCT FROM NEW.content) AND
     (OLD.excerpt IS NOT DISTINCT FROM NEW.excerpt) AND
     (OLD.thumbnail_url IS NOT DISTINCT FROM NEW.thumbnail_url) AND
     (OLD.thumbnail_type IS NOT DISTINCT FROM NEW.thumbnail_type) AND
     (OLD.status IS NOT DISTINCT FROM NEW.status) AND
     (OLD.published_at IS NOT DISTINCT FROM NEW.published_at) AND
     (OLD.author_id IS NOT DISTINCT FROM NEW.author_id) AND
     (OLD.meta_description IS NOT DISTINCT FROM NEW.meta_description) AND
     (OLD.is_featured IS NOT DISTINCT FROM NEW.is_featured) AND
     (OLD.og_image_url IS NOT DISTINCT FROM NEW.og_image_url) THEN
    -- view_count のみが変更された場合、updated_at はそのまま
    RETURN NEW;
  ELSE
    -- それ以外の変更の場合、updated_at を更新
    NEW.updated_at = NOW();
    RETURN NEW;
  END IF;
END;
$$;

-- トリガーは既に存在するので再作成は不要
-- (関数を上書きしたので、既存のトリガーが新しい関数を使用する)

-- 既存のトリガー確認（デバッグ用）
-- SELECT tgname, tgtype, tgenabled FROM pg_trigger WHERE tgrelid = 'posts'::regclass;
