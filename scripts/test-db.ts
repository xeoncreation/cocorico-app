import { supabase } from '../src/app/lib/supabase-client';
import type { Database } from '../src/types/supabase';

type Message = Database['public']['Tables']['messages']['Row'];

async function testDatabase() {
  console.log('🔍 Verificando estructura de la tabla...');
  
  // 1. Verificar si la tabla existe
  const { data: tables, error: tableError } = await supabase
    .from('information_schema.tables')
    .select('*')
    .eq('table_schema', 'public')
    .eq('table_name', 'messages');

  if (tableError) {
    console.error('Error al verificar la tabla:', tableError);
    return;
  }

  if (tables.length === 0) {
    console.log('❌ La tabla messages no existe. Necesita ser creada.');
    return;
  }

  // 2. Verificar columnas
  const { data: columns, error: columnError } = await supabase
    .from('information_schema.columns')
    .select('*')
    .eq('table_schema', 'public')
    .eq('table_name', 'messages');

  if (columnError) {
    console.error('Error al verificar columnas:', columnError);
    return;
  }

  console.log('\n📋 Columnas encontradas:');
  columns.forEach(col => {
    console.log(`- ${col.column_name} (${col.data_type})`);
  });

  // 3. Verificar políticas
  const { data: policies, error: policyError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('schemaname', 'public')
    .eq('tablename', 'messages');

  if (policyError) {
    console.error('Error al verificar políticas:', policyError);
    return;
  }

  console.log('\n🔒 Políticas encontradas:');
  policies.forEach(policy => {
    console.log(`- ${policy.policyname}`);
  });

  // 4. Intentar insertar un mensaje de prueba
  console.log('\n🧪 Intentando insertar un mensaje de prueba...');
  const { data: insertResult, error: insertError } = await supabase
    .from('messages')
    .insert({
      role: 'user',
      content: 'Mensaje de prueba',
      // No incluimos user_id para probar la política RLS
    })
    .select();

  if (insertError) {
    if (insertError.code === 'PGRST116') {
      console.log('✅ Política RLS funcionando correctamente - Rechazó inserción sin user_id');
    } else {
      console.error('Error inesperado al insertar:', insertError);
    }
  } else {
    console.log('⚠️ Advertencia: La inserción funcionó sin user_id - Revisar políticas RLS');
  }
}

testDatabase().catch(console.error);