-- Agregar columna emoji a user_profiles
-- Esta columna permitirá a los usuarios personalizar su avatar con un emoji

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '👤';

-- Comentario para documentación
COMMENT ON COLUMN user_profiles.emoji IS 'Emoji personalizado del usuario para usar como avatar';
