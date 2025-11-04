import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dxhgpjrgvkxudetbmxuw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aGdwanJndmt4dWRldGJteHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjE0MjAsImV4cCI6MjA3NzIzNzQyMH0.vcATRIpwJuuDjk5CeyUiw22yHFm0E5m6SsAFflO3o_g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🔄 Probando conexión a la tabla messages...');

  try {
    // Intentar hacer una consulta simple
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('✅ Conexión exitosa a la tabla messages');
    console.log(`📊 Mensajes encontrados: ${data.length}`);

    if (data.length > 0) {
      console.log('\n📝 Ejemplo de mensaje:');
      console.log(data[0]);
    }

    // Probar inserción sin autenticación
    console.log('\n🔄 Probando inserción sin autenticación (debe fallar)...');
    const testMessage = {
      role: 'user' as const,
      content: 'Mensaje de prueba'
    };

    const { error: insertError } = await supabase
      .from('messages')
      .insert(testMessage);

    if (insertError) {
      if (insertError.code === 'PGRST116') {
        console.log('✅ RLS funcionando correctamente - Se requiere autenticación para insertar');
      } else {
        throw insertError;
      }
    } else {
      console.log('⚠️ ADVERTENCIA: La inserción funcionó sin autenticación - Revisar RLS');
    }

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

console.log('🚀 Iniciando pruebas de la tabla messages...');
testDatabase();