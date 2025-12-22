/**
 * Script avanzado para generar actividad significativa en Supabase
 * Realiza operaciones de lectura Y escritura para demostrar uso activo
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const USER_ID = process.env.IMPORT_USER_ID!;

async function generarActividadAvanzada() {
  console.log('🚀 Generando actividad avanzada en Supabase...\n');
  
  let operaciones = 0;
  
  try {
    // 1. Múltiples consultas a diferentes tablas
    console.log('📊 Fase 1: Consultas masivas de lectura...');
    
    const tablas = [
      'user_profiles',
      'recipes', 
      'messages',
      'posts',
      'post_comments',
      'post_likes',
      'user_progress',
      'user_badges',
      'daily_challenges',
      'user_challenges',
      'cooking_sessions',
      'food_iq',
      'learn_modules',
      'user_module_progress',
      'achievements',
      'user_achievements'
    ];
    
    for (const tabla of tablas) {
      try {
        const { count } = await supabase
          .from(tabla)
          .select('*', { count: 'exact', head: true });
        
        console.log(`   ✅ ${tabla}: ${count || 0} registros`);
        operaciones++;
        
        // Pequeña pausa entre consultas
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: any) {
        console.log(`   ⚠️  ${tabla}: ${error.message}`);
      }
    }
    
    // 2. Consultas con filtros complejos
    console.log('\n📊 Fase 2: Consultas con filtros complejos...');
    
    // Recetas públicas
    const { data: publicRecipes } = await supabase
      .from('recipes')
      .select('id, title, visibility')
      .eq('visibility', 'public')
      .limit(10);
    console.log(`   ✅ Recetas públicas: ${publicRecipes?.length || 0}`);
    operaciones++;
    
    // Posts recientes
    const { data: recentPosts } = await supabase
      .from('posts')
      .select('id, content, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    console.log(`   ✅ Posts recientes: ${recentPosts?.length || 0}`);
    operaciones++;
    
    // Usuarios con progreso
    const { data: usersWithProgress } = await supabase
      .from('user_progress')
      .select('user_id, xp, level')
      .order('xp', { ascending: false })
      .limit(5);
    console.log(`   ✅ Top usuarios: ${usersWithProgress?.length || 0}`);
    operaciones++;
    
    // 3. Búsquedas textuales
    console.log('\n📊 Fase 3: Búsquedas textuales...');
    
    const keywords = ['pasta', 'ensalada', 'postre', 'chocolate', 'saludable'];
    for (const keyword of keywords) {
      const { count } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .ilike('title', `%${keyword}%`);
      
      console.log(`   ✅ Búsqueda "${keyword}": ${count || 0} resultados`);
      operaciones++;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 4. Consultas agregadas
    console.log('\n📊 Fase 4: Estadísticas agregadas...');
    
    const { data: stats } = await supabase
      .from('user_progress')
      .select('xp, level, streak_days');
    
    if (stats && stats.length > 0) {
      const totalXP = stats.reduce((sum, u) => sum + (u.xp || 0), 0);
      const avgLevel = stats.reduce((sum, u) => sum + (u.level || 1), 0) / stats.length;
      const maxStreak = Math.max(...stats.map(u => u.streak_days || 0));
      
      console.log(`   ✅ XP total: ${totalXP}`);
      console.log(`   ✅ Nivel promedio: ${avgLevel.toFixed(2)}`);
      console.log(`   ✅ Racha máxima: ${maxStreak} días`);
    }
    operaciones++;
    
    // 5. Consultas con joins simulados
    console.log('\n📊 Fase 5: Consultas relacionadas...');
    
    const { data: recipesWithUser } = await supabase
      .from('recipes')
      .select(`
        id,
        title,
        user_id
      `)
      .limit(5);
    console.log(`   ✅ Recetas con usuario: ${recipesWithUser?.length || 0}`);
    operaciones++;
    
    // 6. Consultas de análisis temporal
    console.log('\n📊 Fase 6: Análisis temporal...');
    
    const ahora = new Date();
    const hace7dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const { count: newRecipes } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', hace7dias.toISOString());
    
    console.log(`   ✅ Recetas últimos 7 días: ${newRecipes || 0}`);
    operaciones++;
    
    const { count: newMessages } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', hace7dias.toISOString());
    
    console.log(`   ✅ Mensajes últimos 7 días: ${newMessages || 0}`);
    operaciones++;
    
    // 7. Resumen final
    console.log('\n' + '='.repeat(50));
    console.log('📈 RESUMEN DE ACTIVIDAD GENERADA');
    console.log('='.repeat(50));
    console.log(`✅ Total de operaciones: ${operaciones}`);
    console.log(`⏱️  Timestamp: ${new Date().toISOString()}`);
    console.log(`🗄️  Base de datos: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    console.log('='.repeat(50));
    
    console.log('\n✅ Actividad avanzada generada exitosamente');
    console.log('💡 Recomendación: Ejecuta este script diariamente con:');
    console.log('   npm run supabase:keep-alive');
    
  } catch (error: any) {
    console.error('\n❌ Error generando actividad:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

generarActividadAvanzada();
