-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================
-- Categories Table
-- ===========================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories Index
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_order ON categories("order");

-- ===========================
-- Posts Table
-- ===========================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  excerpt TEXT,
  thumbnail_url TEXT,
  thumbnail_type TEXT CHECK (thumbnail_type IN ('auto', 'custom')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'private')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meta_description TEXT,
  view_count INTEGER DEFAULT 0
);

-- Posts Indexes
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- ===========================
-- Post Categories (Junction Table)
-- ===========================
CREATE TABLE post_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, category_id)
);

-- Post Categories Indexes
CREATE INDEX idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);

-- ===========================
-- Analytics Cache Table
-- ===========================
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Cache Index
CREATE INDEX idx_analytics_cache_key ON analytics_cache(cache_key);
CREATE INDEX idx_analytics_cache_expires_at ON analytics_cache(expires_at);

-- ===========================
-- Updated At Trigger Function
-- ===========================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to posts
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to analytics_cache
CREATE TRIGGER update_analytics_cache_updated_at
  BEFORE UPDATE ON analytics_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================
-- Initial Data (Categories)
-- ===========================
INSERT INTO categories (name, slug, description, color, "order") VALUES
  ('日常', 'daily', '日々の出来事、気づき', '#10b981', 1),
  ('開発', 'development', 'プログラミング、技術的な話題', '#3b82f6', 2),
  ('経営', 'business', '整体院の経営、ビジネス', '#f59e0b', 3),
  ('読書', 'books', '読んだ本の感想、学び', '#8b5cf6', 4);

-- ===========================
-- Row Level Security (RLS)
-- ===========================

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;

-- Posts Policies
-- 公開記事は誰でも読める
CREATE POLICY "Public posts are viewable by everyone"
  ON posts FOR SELECT
  USING (status = 'published');

-- 認証済みユーザー（管理者）は全ての記事を読める
CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

-- 認証済みユーザー（管理者）は記事を作成できる
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 認証済みユーザー（管理者）は記事を更新できる
CREATE POLICY "Authenticated users can update posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 認証済みユーザー（管理者）は記事を削除できる
CREATE POLICY "Authenticated users can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (true);

-- Categories Policies
-- カテゴリは誰でも読める
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- 認証済みユーザー（管理者）はカテゴリを管理できる
CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Post Categories Policies
-- 記事カテゴリは誰でも読める
CREATE POLICY "Post categories are viewable by everyone"
  ON post_categories FOR SELECT
  USING (true);

-- 認証済みユーザー（管理者）は記事カテゴリを管理できる
CREATE POLICY "Authenticated users can manage post categories"
  ON post_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Analytics Cache Policies
-- キャッシュは認証済みユーザーのみアクセス可能
CREATE POLICY "Only authenticated users can access analytics cache"
  ON analytics_cache FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
