/**
 * Script simplificado para verificar/aplicar migración de emoji
 * Usa el cliente anónimo de Supabase (browser client)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno SUPABASE');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyEmojiColumn() {
  console.log('🔍 Verificando columna emoji en user_profiles...\n');
  
  try {
    // Intentar hacer una query que use la columna emoji
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, emoji')
      .limit(1);
    
    if (error) {
      if (error.message.includes('column "emoji" does not exist')) {
        console.log('❌ La columna emoji NO existe en user_profiles\n');
        console.log('📝 Debes ejecutar esta SQL en Supabase Dashboard > SQL Editor:\n');
        console.log('════════════════════════════════════════════════════════');
        console.log(`ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '👤';

COMMENT ON COLUMN user_profiles.emoji IS 'Emoji personalizado del usuario para usar como avatar';`);
        console.log('════════════════════════════════════════════════════════\n');
        console.log('🔗 Link directo: https://supabase.com/dashboard/project/dxhgpjrgvkxudetbmxuw/sql/new\n');
        return false;
      } else {
        console.warn('⚠️  Error al verificar:', error.message);
        return false;
      }
    }
    
    console.log('✅ ¡La columna emoji existe y está lista para usar!\n');
    
    if (data && data.length > 0) {
      console.log(`📊 Ejemplo de datos: Usuario ID ${data[0].id} tiene emoji: ${data[0].emoji || '(ninguno)'}\n`);
    }
    
    return true;
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

verifyEmojiColumn();
