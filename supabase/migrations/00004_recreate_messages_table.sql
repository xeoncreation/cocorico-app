-- Recrear la tabla messages si es necesario
DROP TABLE IF EXISTS public.messages;

CREATE TABLE public.messages (
    id bigserial PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    role text NOT NULL CHECK (role IN ('user', 'assistant')),
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Recrear las políticas
DROP POLICY IF EXISTS messages_select_own ON public.messages;
DROP POLICY IF EXISTS messages_insert_own ON public.messages;

-- Política de selección: los usuarios solo pueden ver sus propios mensajes
CREATE POLICY messages_select_own
ON public.messages FOR SELECT
USING (auth.uid() = user_id);

-- Política de inserción: los usuarios solo pueden insertar sus propios mensajes
CREATE POLICY messages_insert_own
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = user_id);