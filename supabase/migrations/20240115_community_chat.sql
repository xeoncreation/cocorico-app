-- Community Chat Messages Table
-- Stores real-time chat messages for the community

CREATE TABLE IF NOT EXISTS community_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS community_messages_created_at_idx ON community_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS community_messages_user_id_idx ON community_messages(user_id);

-- RLS Policies
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read messages
CREATE POLICY "Authenticated users can read messages"
  ON community_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert their own messages
CREATE POLICY "Users can insert own messages"
  ON community_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own messages (for edits)
CREATE POLICY "Users can update own messages"
  ON community_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
  ON community_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_community_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_community_messages_timestamp
  BEFORE UPDATE ON community_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_community_messages_updated_at();

-- Optional: Add some seed messages for testing
INSERT INTO community_messages (user_id, username, content, is_premium, created_at) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'Chef María', '¡Bienvenidos al chat de Cocorico! 🎉', TRUE, NOW() - INTERVAL '30 minutes'),
  ((SELECT id FROM auth.users LIMIT 1), 'CocineroNovato', '¡Hola a todos! Estoy aprendiendo a cocinar 👨‍🍳', FALSE, NOW() - INTERVAL '20 minutes'),
  ((SELECT id FROM auth.users LIMIT 1), 'Chef García', 'Si necesitas ayuda, no dudes en preguntar. Aquí estamos para ayudar 💪', TRUE, NOW() - INTERVAL '10 minutes');

COMMENT ON TABLE community_messages IS 'Real-time chat messages for the Cocorico community';
COMMENT ON COLUMN community_messages.content IS 'Message content, max 2000 characters';
COMMENT ON COLUMN community_messages.is_premium IS 'Whether the user has premium status';
