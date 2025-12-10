-- =====================================================
-- TABLA: agent_events
-- Almacena eventos, errores y warnings capturados por el agente IA
-- =====================================================

CREATE TABLE IF NOT EXISTS agent_events (
  id UUID PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('error', 'warning', 'info')),
  component VARCHAR(255),
  message TEXT NOT NULL,
  stack TEXT,
  user_agent TEXT,
  url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance de búsqueda
CREATE INDEX IF NOT EXISTS idx_agent_events_timestamp ON agent_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_agent_events_type ON agent_events(type);
CREATE INDEX IF NOT EXISTS idx_agent_events_user_id ON agent_events(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_events_created_at ON agent_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_events_component ON agent_events(component);

-- Índice para búsquedas en metadata (JSONB)
CREATE INDEX IF NOT EXISTS idx_agent_events_metadata ON agent_events USING GIN(metadata);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE agent_events ENABLE ROW LEVEL SECURITY;

-- Policy: Solo el service role puede insertar eventos
-- Esto previene que usuarios maliciosos inserten eventos falsos
CREATE POLICY "Service role can insert events"
  ON agent_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Solo usuarios autenticados pueden insertar sus propios eventos
-- Permite que el cliente capture errores
CREATE POLICY "Authenticated users can insert own events"
  ON agent_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

-- Policy: Solo admins pueden leer todos los eventos
-- Requiere que el usuario tenga role='admin' en su metadata
CREATE POLICY "Admins can read all events"
  ON agent_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (raw_user_meta_data->>'role' = 'admin')
    )
  );

-- Policy: Usuarios pueden leer sus propios eventos
CREATE POLICY "Users can read own events"
  ON agent_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCIÓN: Limpieza automática de eventos antiguos
-- Mantiene solo los últimos 30 días de eventos
-- =====================================================

CREATE OR REPLACE FUNCTION clean_old_agent_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM agent_events
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$;

-- =====================================================
-- VISTA: Resumen de eventos por tipo
-- Útil para dashboards y métricas
-- =====================================================

CREATE OR REPLACE VIEW agent_events_summary AS
SELECT 
  type,
  COUNT(*) as total,
  COUNT(DISTINCT user_id) as unique_users,
  MAX(created_at) as last_occurrence,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as last_hour,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as last_24h,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as last_7d
FROM agent_events
GROUP BY type;

-- =====================================================
-- COMENTARIOS
-- =====================================================

COMMENT ON TABLE agent_events IS 'Almacena eventos, errores y warnings capturados por el sistema de monitoreo del agente IA';
COMMENT ON COLUMN agent_events.id IS 'UUID único generado en el cliente';
COMMENT ON COLUMN agent_events.timestamp IS 'Timestamp Unix en milisegundos del momento del evento';
COMMENT ON COLUMN agent_events.type IS 'Tipo de evento: error, warning, info';
COMMENT ON COLUMN agent_events.component IS 'Componente o módulo donde ocurrió el evento';
COMMENT ON COLUMN agent_events.message IS 'Mensaje descriptivo del evento';
COMMENT ON COLUMN agent_events.stack IS 'Stack trace del error (si aplica)';
COMMENT ON COLUMN agent_events.user_agent IS 'User agent del navegador o "server" si es del backend';
COMMENT ON COLUMN agent_events.url IS 'URL donde ocurrió el evento o "server"';
COMMENT ON COLUMN agent_events.user_id IS 'ID del usuario (si está autenticado)';
COMMENT ON COLUMN agent_events.metadata IS 'Información adicional en formato JSON';
COMMENT ON COLUMN agent_events.created_at IS 'Timestamp de creación en la base de datos';
