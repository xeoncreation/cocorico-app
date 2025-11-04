import { supabase } from '../src/app/lib/supabase-client';

async function testMessagesTable() {
  try {
    console.log('🔄 Probando conexión a la base de datos...');
    
    // Intentar obtener mensajes
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error al acceder a la tabla messages:', error);
      return;
    }

    console.log('✅ Conexión exitosa a la tabla messages');
    console.log(`📊 Número de mensajes encontrados: ${data.length}`);
    
    // Mostrar información de la tabla
    const { data: columnsData, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'messages')
      .eq('table_schema', 'public');

    if (columnsError) {
      console.error('❌ Error al obtener información de las columnas:', columnsError);
    } else if (columnsData) {
      console.log('\n📋 Estructura de la tabla messages:');
      columnsData.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    }

    // Verificar políticas RLS
    console.log('\n🔒 Verificando políticas RLS...');
    const { data: policiesData, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, permissive, cmd')
      .eq('tablename', 'messages')
      .eq('schemaname', 'public');

    if (policiesError) {
      console.error('❌ Error al obtener políticas:', policiesError);
    } else if (policiesData) {
      console.log('Políticas encontradas:');
      policiesData.forEach(policy => {
        console.log(`- ${policy.policyname} (${policy.cmd})`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

console.log('🚀 Iniciando prueba de la tabla messages...');
testMessagesTable();