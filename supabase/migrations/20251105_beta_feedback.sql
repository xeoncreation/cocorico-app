-- Tabla para almacenar feedback de beta testers
CREATE TABLE IF NOT EXISTS beta_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'improvement', 'question', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_email TEXT,
  user_agent TEXT,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'planned', 'completed', 'wont-fix')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_beta_feedback_user_id ON beta_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_status ON beta_feedback(status);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_priority ON beta_feedback(priority);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_created_at ON beta_feedback(created_at DESC);

-- RLS: Los usuarios solo pueden ver su propio feedback
ALTER TABLE beta_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Usuarios pueden insertar su propio feedback
CREATE POLICY "Users can insert their own feedback"
  ON beta_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Usuarios pueden ver su propio feedback
CREATE POLICY "Users can view their own feedback"
  ON beta_feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admins pueden ver todo el feedback
CREATE POLICY "Admins can view all feedback"
  ON beta_feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Admins pueden actualizar feedback (cambiar status, añadir notas)
CREATE POLICY "Admins can update feedback"
  ON beta_feedback FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_beta_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER beta_feedback_updated_at
  BEFORE UPDATE ON beta_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_beta_feedback_updated_at();

-- Comentarios
COMMENT ON TABLE beta_feedback IS 'Feedback de beta testers para mejoras y bugs';
COMMENT ON COLUMN beta_feedback.type IS 'Tipo: bug, feature, improvement, question, other';
COMMENT ON COLUMN beta_feedback.priority IS 'Prioridad: low, medium, high, critical';
COMMENT ON COLUMN beta_feedback.status IS 'Estado: pending, reviewing, planned, completed, wont-fix';
