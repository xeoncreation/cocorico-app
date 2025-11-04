-- Verificar el estado actual de la tabla messages
DO $$ 
BEGIN
    -- 1. Verificar si la tabla existe
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'messages'
    ) THEN
        -- Crear la tabla si no existe
        CREATE TABLE public.messages (
            id bigserial PRIMARY KEY,
            user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
            role text NOT NULL CHECK (role IN ('user', 'assistant')),
            content text NOT NULL,
            created_at timestamptz DEFAULT now()
        );

        -- Habilitar RLS
        ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

        -- Crear políticas
        CREATE POLICY messages_select_own
        ON public.messages FOR SELECT
        USING (auth.uid() = user_id);

        CREATE POLICY messages_insert_own
        ON public.messages FOR INSERT
        WITH CHECK (auth.uid() = user_id);

        RAISE NOTICE 'Tabla messages creada con éxito';
    ELSE
        -- Verificar y corregir la estructura si es necesario
        BEGIN
            -- Verificar columnas
            IF NOT EXISTS (
                SELECT FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'messages' 
                AND column_name = 'role' 
                AND data_type = 'text'
            ) THEN
                ALTER TABLE public.messages ADD COLUMN role text NOT NULL CHECK (role IN ('user', 'assistant'));
                RAISE NOTICE 'Columna role añadida';
            END IF;

            -- Verificar RLS
            IF NOT EXISTS (
                SELECT FROM pg_policies 
                WHERE schemaname = 'public' 
                AND tablename = 'messages' 
                AND policyname = 'messages_select_own'
            ) THEN
                CREATE POLICY messages_select_own
                ON public.messages FOR SELECT
                USING (auth.uid() = user_id);
                RAISE NOTICE 'Política select_own añadida';
            END IF;

            IF NOT EXISTS (
                SELECT FROM pg_policies 
                WHERE schemaname = 'public' 
                AND tablename = 'messages' 
                AND policyname = 'messages_insert_own'
            ) THEN
                CREATE POLICY messages_insert_own
                ON public.messages FOR INSERT
                WITH CHECK (auth.uid() = user_id);
                RAISE NOTICE 'Política insert_own añadida';
            END IF;

            -- Asegurar que RLS está habilitado
            ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
        END;
    END IF;
END $$;