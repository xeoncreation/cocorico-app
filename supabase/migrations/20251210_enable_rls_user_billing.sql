-- Migration: Enable RLS on user_billing table
-- Created: December 10, 2025
-- Description: Creates user_billing table (if not exists) and enables Row Level Security

-- Create user_billing table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_billing (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_user_billing_stripe_customer_id 
  ON public.user_billing(stripe_customer_id);

-- Enable Row Level Security
ALTER TABLE public.user_billing ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own billing data
CREATE POLICY "Users can view own billing"
  ON public.user_billing
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own billing data
CREATE POLICY "Users can insert own billing"
  ON public.user_billing
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own billing data
CREATE POLICY "Users can update own billing"
  ON public.user_billing
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can manage all billing (for Stripe webhooks)
CREATE POLICY "Service role can manage billing"
  ON public.user_billing
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Add helpful comments
COMMENT ON TABLE public.user_billing IS 'Stores Stripe customer information for billing portal access';
COMMENT ON COLUMN public.user_billing.stripe_customer_id IS 'Stripe customer ID for billing portal sessions';
