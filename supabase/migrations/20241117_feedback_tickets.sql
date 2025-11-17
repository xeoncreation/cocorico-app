-- Migration: Create feedback_tickets table
-- Created: 2024-11-17
-- Description: Sistema completo de feedback/tickets/sugerencias

CREATE TABLE IF NOT EXISTS public.feedback_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Ticket data
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bug', 'feature', 'improvement')),
  description TEXT NOT NULL,
  image_url TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'working', 'done', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  -- Voting/engagement
  votes INTEGER DEFAULT 0,
  
  -- Admin response
  admin_response TEXT,
  admin_user_id UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_feedback_tickets_user_id ON public.feedback_tickets(user_id);
CREATE INDEX idx_feedback_tickets_status ON public.feedback_tickets(status);
CREATE INDEX idx_feedback_tickets_category ON public.feedback_tickets(category);
CREATE INDEX idx_feedback_tickets_created_at ON public.feedback_tickets(created_at DESC);

-- RLS Policies
ALTER TABLE public.feedback_tickets ENABLE ROW LEVEL SECURITY;

-- Users can read all tickets (public feedback)
CREATE POLICY "feedback_tickets_read_all" ON public.feedback_tickets
  FOR SELECT USING (true);

-- Users can insert their own tickets
CREATE POLICY "feedback_tickets_insert_own" ON public.feedback_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own tickets (if not resolved)
CREATE POLICY "feedback_tickets_update_own" ON public.feedback_tickets
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND status != 'done' 
    AND status != 'closed'
  );

-- Admin policy (update this with your admin email)
CREATE POLICY "feedback_tickets_admin_all" ON public.feedback_tickets
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@cocorico.app'
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feedback_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.status IN ('done', 'closed') AND OLD.status NOT IN ('done', 'closed') THEN
    NEW.resolved_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER trigger_feedback_tickets_updated_at
  BEFORE UPDATE ON public.feedback_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_tickets_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.feedback_tickets TO authenticated;
GRANT SELECT ON public.feedback_tickets TO anon;

-- Comments
COMMENT ON TABLE public.feedback_tickets IS 'User feedback, bug reports, and feature requests';
COMMENT ON COLUMN public.feedback_tickets.category IS 'Type of feedback: bug, feature, improvement';
COMMENT ON COLUMN public.feedback_tickets.status IS 'Current status: pending, working, done, closed';
COMMENT ON COLUMN public.feedback_tickets.votes IS 'Community votes for this suggestion';
