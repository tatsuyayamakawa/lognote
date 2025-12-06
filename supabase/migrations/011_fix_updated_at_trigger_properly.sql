-- ===========================
-- Updated At Trigger Function (Proper Fix)
-- view_count のみが更新された場合は updated_at を更新しない
-- view_count が変更されない場合も updated_at を更新しない
-- ===========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- view_count が変更されていない場合は、通常の更新として扱う
  IF (OLD.view_count IS NOT DISTINCT FROM NEW.view_count) THEN
    -- view_count 以外のカラムが変更されているかチェック
    IF (OLD.title IS DISTINCT FROM NEW.title) OR
       (OLD.slug IS DISTINCT FROM NEW.slug) OR
       (OLD.content IS DISTINCT FROM NEW.content) OR
       (OLD.excerpt IS DISTINCT FROM NEW.excerpt) OR
       (OLD.thumbnail_url IS DISTINCT FROM NEW.thumbnail_url) OR
       (OLD.thumbnail_type IS DISTINCT FROM NEW.thumbnail_type) OR
       (OLD.status IS DISTINCT FROM NEW.status) OR
       (OLD.published_at IS DISTINCT FROM NEW.published_at) OR
       (OLD.author_id IS DISTINCT FROM NEW.author_id) OR
       (OLD.meta_description IS DISTINCT FROM NEW.meta_description) OR
       (OLD.is_featured IS DISTINCT FROM NEW.is_featured) OR
       (OLD.og_image_url IS DISTINCT FROM NEW.og_image_url) THEN
      -- view_count 以外が変更された場合、updated_at を更新
      NEW.updated_at = NOW();
    END IF;
    -- view_count も他のカラムも変更されていない場合は何もしない
    RETURN NEW;
  END IF;

  -- view_count のみが変更された場合
  IF (OLD.title IS NOT DISTINCT FROM NEW.title) AND
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
    -- view_count のみが変更された場合、updated_at を更新しない
    RETURN NEW;
  ELSE
    -- view_count と他のカラムも変更された場合、updated_at を更新
    NEW.updated_at = NOW();
    RETURN NEW;
  END IF;
END;
$$;

-- トリガーは既に存在するので再作成は不要
-- (関数を上書きしたので、既存のトリガーが新しい関数を使用する)

-- 動作確認用コメント:
-- このトリガーは以下のように動作します:
-- 1. view_count のみが変更 → updated_at は更新されない
-- 2. view_count が変更されず、他のカラムが変更 → updated_at は更新される
-- 3. view_count も変更されず、他のカラムも変更されない → updated_at は更新されない
-- 4. view_count と他のカラムが両方変更 → updated_at は更新される
