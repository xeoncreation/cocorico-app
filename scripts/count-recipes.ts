import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dxhgpjrgvkxudetbmxuw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aGdwanJndmt4dWRldGJteHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjE0MjAsImV4cCI6MjA3NzIzNzQyMH0.vcATRIpwJuuDjk5CeyUiw22yHFm0E5m6SsAFflO3o_g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function countRecipes() {
  console.log('🔍 Analizando recetas en la base de datos...\n');
  
  const { data, count, error } = await supabase
    .from('recipes')
    .select('id, title, ingredients, steps, source_type, servings, prep_time_minutes, cook_time_minutes, visibility', { count: 'exact' })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  console.log(`📊 TOTAL DE RECETAS: ${count}`);
  
  if (data && data.length > 0) {
    const withIngredients = data.filter(r => r.ingredients && Array.isArray(r.ingredients) && r.ingredients.length > 0);
    const withSteps = data.filter(r => r.steps && Array.isArray(r.steps) && r.steps.length > 0);
    const complete = data.filter(r => 
      r.ingredients && Array.isArray(r.ingredients) && r.ingredients.length > 0 &&
      r.steps && Array.isArray(r.steps) && r.steps.length > 0
    );
    const imported = data.filter(r => r.source_type === 'imported');
    const userCreated = data.filter(r => r.source_type === 'user_created');
    const publicRecipes = data.filter(r => r.visibility === 'public');
    
    console.log(`├─ Con ingredientes: ${withIngredients.length}`);
    console.log(`├─ Con pasos: ${withSteps.length}`);
    console.log(`├─ Completas (ingredientes + pasos): ${complete.length}`);
    console.log(`├─ Importadas: ${imported.length}`);
    console.log(`├─ Creadas por usuarios: ${userCreated.length}`);
    console.log(`└─ Públicas: ${publicRecipes.length}\n`);
    
    console.log('📝 EJEMPLOS DE RECETAS:\n');
    data.slice(0, 5).forEach((r, i) => {
      console.log(`${i + 1}. "${r.title}"`);
      console.log(`   - Tipo: ${r.source_type || 'N/A'}`);
      console.log(`   - Ingredientes: ${Array.isArray(r.ingredients) ? r.ingredients.length : 0}`);
      console.log(`   - Pasos: ${Array.isArray(r.steps) ? r.steps.length : 0}`);
      console.log(`   - Porciones: ${r.servings || 'N/A'}`);
      console.log(`   - Tiempo: ${r.prep_time_minutes ? r.prep_time_minutes + ' min prep' : 'N/A'}${r.cook_time_minutes ? ' + ' + r.cook_time_minutes + ' min cocción' : ''}`);
      console.log('');
    });
  } else {
    console.log('⚠️  No hay recetas en la base de datos');
  }
}

countRecipes();
