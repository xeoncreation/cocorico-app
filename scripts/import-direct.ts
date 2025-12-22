/**
 * Script directo para importar recetas sin RLS
 * Temporal hasta configurar SERVICE_ROLE_KEY
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const USER_ID = process.env.IMPORT_USER_ID!;

const recetas = [
  {
    user_id: USER_ID,
    title: 'Pasta Carbonara',
    description: 'Clásica receta italiana con salsa cremosa de huevo y bacon',
    ingredients: [
      { name: 'pasta', amount: 400, unit: 'g' },
      { name: 'bacon', amount: 200, unit: 'g' },
      { name: 'huevos', amount: 4, unit: 'unit' },
      { name: 'queso parmesano', amount: 100, unit: 'g' },
      { name: 'sal', amount: 1, unit: 'pinch' },
      { name: 'pimienta', amount: 1, unit: 'pinch' }
    ],
    steps: [
      'Hervir agua con sal y cocinar la pasta según instrucciones del paquete',
      'Cortar el bacon en trozos y freír hasta que esté crujiente',
      'Batir los huevos con el queso parmesano rallado',
      'Escurrir la pasta reservando un poco de agua',
      'Mezclar la pasta caliente con el bacon',
      'Retirar del fuego y agregar la mezcla de huevos batiendo rápidamente',
      'Añadir agua de la pasta si es necesario para crear una salsa cremosa',
      'Servir inmediatamente con más queso y pimienta'
    ],
    servings: 4,
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    total_time_minutes: 25,
    category: 'cena',
    tags: ['pasta', 'italiano', 'rápido'],
    difficulty: 'easy',
    visibility: 'public',
    source_type: 'imported',
    source_name: 'CSV Import',
    is_verified: true
  },
  {
    user_id: USER_ID,
    title: 'Ensalada César',
    description: 'Ensalada fresca con aderezo césar casero',
    ingredients: [
      { name: 'lechuga romana', amount: 1, unit: 'unit' },
      { name: 'crutones', amount: 50, unit: 'g' },
      { name: 'aderezo césar', amount: 30, unit: 'ml' },
      { name: 'queso parmesano', amount: 20, unit: 'g' },
      { name: 'anchoas', amount: 2, unit: 'unit' }
    ],
    steps: [
      'Lavar y secar la lechuga, luego cortarla en trozos',
      'Preparar el aderezo mezclando anchoas, ajo, limón y aceite de oliva',
      'En un bowl grande, mezclar la lechuga con el aderezo',
      'Agregar los crutones y el queso parmesano rallado',
      'Mezclar suavemente y servir inmediatamente'
    ],
    servings: 2,
    prep_time_minutes: 15,
    cook_time_minutes: 0,
    total_time_minutes: 15,
    category: 'entrada',
    tags: ['ensalada', 'vegetariano'],
    difficulty: 'easy',
    visibility: 'public',
    source_type: 'imported',
    source_name: 'CSV Import',
    is_verified: true
  },
  {
    user_id: USER_ID,
    title: 'Tacos al Pastor',
    description: 'Tacos mexicanos con carne marinada al estilo pastor',
    ingredients: [
      { name: 'carne de cerdo', amount: 500, unit: 'g' },
      { name: 'tortillas', amount: 3, unit: 'unit' },
      { name: 'piña', amount: 100, unit: 'g' },
      { name: 'cebolla', amount: 50, unit: 'g' },
      { name: 'cilantro', amount: 20, unit: 'g' },
      { name: 'limones', amount: 2, unit: 'unit' },
      { name: 'adobo', amount: 30, unit: 'ml' }
    ],
    steps: [
      'Marinar la carne con el adobo durante al menos 2 horas',
      'Cortar la piña en trozos pequeños',
      'Calentar una sartén y cocinar la carne marinada hasta que esté bien dorada',
      'Calentar las tortillas en un comal o sartén',
      'Cortar la carne en trozos pequeños',
      'Armar los tacos colocando carne, piña, cebolla picada y cilantro',
      'Servir con limón al lado'
    ],
    servings: 3,
    prep_time_minutes: 20,
    cook_time_minutes: 15,
    total_time_minutes: 35,
    category: 'cena',
    tags: ['mexicano', 'tacos', 'picante'],
    difficulty: 'medium',
    visibility: 'public',
    source_type: 'imported',
    source_name: 'CSV Import',
    is_verified: true
  },
  {
    user_id: USER_ID,
    title: 'Smoothie de Frutas',
    description: 'Batido saludable de frutas y yogur',
    ingredients: [
      { name: 'plátano', amount: 1, unit: 'unit' },
      { name: 'fresas', amount: 150, unit: 'g' },
      { name: 'yogur natural', amount: 200, unit: 'ml' },
      { name: 'leche', amount: 100, unit: 'ml' },
      { name: 'miel', amount: 15, unit: 'ml' },
      { name: 'cubos de hielo', amount: 5, unit: 'unit' }
    ],
    steps: [
      'Pelar el plátano y cortarlo en rodajas',
      'Lavar las fresas y quitar los tallos',
      'Colocar todos los ingredientes en una licuadora',
      'Licuar a alta velocidad hasta obtener una mezcla suave y homogénea',
      'Probar y ajustar dulzor con más miel si es necesario',
      'Servir inmediatamente en vasos fríos'
    ],
    servings: 2,
    prep_time_minutes: 5,
    cook_time_minutes: 0,
    total_time_minutes: 5,
    category: 'desayuno',
    tags: ['saludable', 'smoothie', 'vegetariano', 'rápido'],
    difficulty: 'easy',
    visibility: 'public',
    source_type: 'imported',
    source_name: 'CSV Import',
    is_verified: true
  },
  {
    user_id: USER_ID,
    title: 'Brownies de Chocolate',
    description: 'Brownies densos y chocolatosos con nueces',
    ingredients: [
      { name: 'chocolate negro', amount: 200, unit: 'g' },
      { name: 'mantequilla', amount: 150, unit: 'g' },
      { name: 'azúcar', amount: 200, unit: 'g' },
      { name: 'huevos', amount: 3, unit: 'unit' },
      { name: 'harina', amount: 100, unit: 'g' },
      { name: 'cacao en polvo', amount: 30, unit: 'g' },
      { name: 'nueces', amount: 100, unit: 'g' },
      { name: 'sal', amount: 1, unit: 'pinch' }
    ],
    steps: [
      'Precalentar el horno a 180°C (350°F)',
      'Engrasar y enharinar un molde cuadrado de 20x20 cm',
      'Derretir el chocolate y la mantequilla al baño maría o en microondas',
      'Dejar enfriar ligeramente la mezcla de chocolate',
      'Batir los huevos con el azúcar hasta que estén espumosos',
      'Incorporar la mezcla de chocolate a los huevos batiendo suavemente',
      'Tamizar la harina, el cacao y la sal, luego incorporar a la mezcla',
      'Agregar las nueces picadas y mezclar suavemente',
      'Verter la mezcla en el molde preparado',
      'Hornear por 25-30 minutos (el centro debe quedar ligeramente húmedo)',
      'Dejar enfriar completamente antes de cortar en cuadros',
      'Servir a temperatura ambiente o ligeramente tibios'
    ],
    servings: 12,
    prep_time_minutes: 20,
    cook_time_minutes: 30,
    total_time_minutes: 50,
    category: 'postre',
    tags: ['chocolate', 'postre', 'brownie'],
    difficulty: 'medium',
    visibility: 'public',
    source_type: 'imported',
    source_name: 'CSV Import',
    is_verified: true
  }
];

async function importar() {
  console.log('🚀 Importando 5 recetas de ejemplo...\n');
  
  // Insertar sin RLS bypass (se espera que falle, pero muestra el problema)
  const { data, error } = await supabase
    .from('recipes')
    .insert(recetas)
    .select();
  
  if (error) {
    console.error('❌ Error RLS:', error.message);
    console.log('\n⚠️  SOLUCIÓN: Necesitas configurar SUPABASE_SERVICE_ROLE_KEY en .env.local');
    console.log('📍 Obtenla desde: Supabase Dashboard → Settings → API → service_role key');
    console.log('\nO ejecuta este SQL en Supabase para deshabilitar temporalmente RLS:');
    console.log('```sql');
    console.log('ALTER TABLE public.recipes DISABLE ROW LEVEL SECURITY;');
    console.log('```');
    process.exit(1);
  }
  
  console.log(`✅ ${data?.length || 0} recetas importadas exitosamente`);
  data?.forEach((r: any) => console.log(`  - ${r.title}`));
}

importar();
