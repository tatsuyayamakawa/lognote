-- Add is_featured column to posts table
ALTER TABLE posts ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Add index for featured posts
CREATE INDEX idx_posts_is_featured ON posts(is_featured) WHERE is_featured = true;
