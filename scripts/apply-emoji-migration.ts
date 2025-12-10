/**
 * Script para aplicar migración de columna emoji a user_profiles
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🚀 Iniciando migración: agregar columna emoji a user_profiles...');
  
  try {
    // Ejecutar migración SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE user_profiles 
        ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '👤';
        
        COMMENT ON COLUMN user_profiles.emoji IS 'Emoji personalizado del usuario para usar como avatar';
      `
    });

    if (error) {
      // Si rpc no existe, intentar con query directa
      console.log('⚠️  RPC no disponible, intentando ejecutar con query directa...');
      
      const { error: alterError } = await supabase
        .from('user_profiles')
        .select('emoji')
        .limit(1);
      
      if (alterError && alterError.message.includes('column "emoji" does not exist')) {
        console.log('📝 La columna emoji no existe, se necesita ejecutar manualmente en SQL Editor');
        console.log('\nCopia y ejecuta en Supabase SQL Editor:');
        console.log('─────────────────────────────────────────');
        console.log(`ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '👤';

COMMENT ON COLUMN user_profiles.emoji IS 'Emoji personalizado del usuario para usar como avatar';`);
        console.log('─────────────────────────────────────────');
        return;
      }
    }

    console.log('✅ Migración aplicada exitosamente!');
    
    // Verificar que la columna existe
    const { data, error: checkError } = await supabase
      .from('user_profiles')
      .select('id, emoji')
      .limit(1);
    
    if (checkError) {
      console.warn('⚠️  No se pudo verificar la columna:', checkError.message);
    } else {
      console.log('✅ Columna emoji verificada en user_profiles');
    }
    
  } catch (error) {
    console.error('❌ Error aplicando migración:', error);
    console.log('\n💡 Ejecuta manualmente en Supabase SQL Editor:');
    console.log('─────────────────────────────────────────');
    console.log(`ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS emoji TEXT DEFAULT '👤';

COMMENT ON COLUMN user_profiles.emoji IS 'Emoji personalizado del usuario para usar como avatar';`);
    console.log('─────────────────────────────────────────');
  }
}

applyMigration();
