/**
 * Script para generar actividad en Supabase
 * Previene que el proyecto entre en pausa por inactividad
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const USER_ID = process.env.IMPORT_USER_ID!;

async function generarActividad() {
  console.log('🚀 Generando actividad en Supabase...\n');
  
  try {
    // 1. Consultar usuarios
    console.log('📊 Consultando usuarios...');
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email')
      .limit(5);
    
    if (!usersError) {
      console.log(`   ✅ ${users?.length || 0} usuarios encontrados`);
    }
    
    // 2. Consultar recetas
    console.log('📊 Consultando recetas...');
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('id, title, visibility')
      .limit(10);
    
    if (!recipesError) {
      console.log(`   ✅ ${recipes?.length || 0} recetas encontradas`);
    }
    
    // 3. Consultar mensajes
    console.log('📊 Consultando mensajes del chat...');
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('id, role')
      .limit(5);
    
    if (!messagesError) {
      console.log(`   ✅ ${messages?.length || 0} mensajes encontrados`);
    }
    
    // 4. Consultar posts de la comunidad
    console.log('📊 Consultando posts de comunidad...');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, content')
      .limit(5);
    
    if (!postsError) {
      console.log(`   ✅ ${posts?.length || 0} posts encontrados`);
    }
    
    // 5. Consultar progreso de usuarios
    console.log('📊 Consultando progreso de usuarios...');
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('user_id, xp, level')
      .limit(5);
    
    if (!progressError) {
      console.log(`   ✅ ${progress?.length || 0} registros de progreso`);
    }
    
    // 6. Consultar badges
    console.log('📊 Consultando badges...');
    const { data: badges, error: badgesError } = await supabase
      .from('user_badges')
      .select('user_id, badge_id')
      .limit(5);
    
    if (!badgesError) {
      console.log(`   ✅ ${badges?.length || 0} badges encontrados`);
    }
    
    // 7. Consultar challenges
    console.log('📊 Consultando challenges...');
    const { data: challenges, error: challengesError } = await supabase
      .from('daily_challenges')
      .select('id, title')
      .limit(5);
    
    if (!challengesError) {
      console.log(`   ✅ ${challenges?.length || 0} challenges encontrados`);
    }
    
    // 8. Consultar food_iq
    console.log('📊 Consultando Food-IQ...');
    const { data: foodiq, error: foodiqError } = await supabase
      .from('food_iq')
      .select('id, common_name')
      .limit(5);
    
    if (!foodiqError) {
      console.log(`   ✅ ${foodiq?.length || 0} alimentos en Food-IQ`);
    }
    
    // 9. Estadísticas generales
    console.log('\n📈 Obteniendo estadísticas generales...');
    
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalRecipes } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalPosts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 ESTADÍSTICAS DEL PROYECTO:`);
    console.log(`   👥 Total usuarios: ${totalUsers || 0}`);
    console.log(`   🍳 Total recetas: ${totalRecipes || 0}`);
    console.log(`   💬 Total mensajes de chat: ${totalMessages || 0}`);
    console.log(`   📱 Total posts de comunidad: ${totalPosts || 0}`);
    
    console.log('\n✅ Actividad generada exitosamente');
    console.log('🔄 Ejecuta este script periódicamente para mantener el proyecto activo');
    
  } catch (error: any) {
    console.error('❌ Error generando actividad:', error.message);
    process.exit(1);
  }
}

generarActividad();
