-- Add premium status fields to profiles table
-- Adds is_premium boolean and related timestamps

-- Add columns if they don't exist
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS premium_since TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS premium_expires_at TIMESTAMPTZ;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS profiles_is_premium_idx ON profiles(is_premium);

-- Create transactions table to track payments
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed', 'processing', 'canceled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for transactions
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON transactions(created_at DESC);

-- RLS Policies for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Only the system (via service role) can insert transactions
-- This is handled by the webhook endpoint with SUPABASE_SERVICE_ROLE_KEY

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_transactions_timestamp
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transactions_updated_at();

-- Helper function to check if user is premium
CREATE OR REPLACE FUNCTION is_user_premium(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = check_user_id
      AND is_premium = TRUE
      AND (premium_expires_at IS NULL OR premium_expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Add some test data (comment out in production)
-- UPDATE profiles SET is_premium = TRUE, premium_since = NOW(), premium_expires_at = NOW() + INTERVAL '1 year' WHERE id = (SELECT id FROM auth.users LIMIT 1);

COMMENT ON COLUMN profiles.is_premium IS 'Whether user has active premium subscription';
COMMENT ON COLUMN profiles.premium_since IS 'When the user first became premium';
COMMENT ON COLUMN profiles.premium_expires_at IS 'When premium expires (NULL = lifetime)';
COMMENT ON TABLE transactions IS 'Payment transaction history';
