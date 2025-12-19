-- Google AdSense OAuth tokens table
-- Stores OAuth 2.0 tokens for AdSense Management API access

CREATE TABLE IF NOT EXISTS google_adsense_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one token per user
  UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE google_adsense_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only access their own tokens
CREATE POLICY "Users can view their own AdSense tokens"
  ON google_adsense_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AdSense tokens"
  ON google_adsense_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AdSense tokens"
  ON google_adsense_tokens
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AdSense tokens"
  ON google_adsense_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_google_adsense_tokens_updated_at
  BEFORE UPDATE ON google_adsense_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_google_adsense_tokens_user_id
  ON google_adsense_tokens(user_id);
