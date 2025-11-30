#!/usr/bin/env node
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase keys are not configured. seed-e2e will no-op.');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sampleRecipes = [
  {
    title: 'Pasta con verduras (demo)',
    slug: 'pasta-con-verduras',
    description: 'Receta demo para tests',
    public: true,
    content: 'Ingredientes: pasta, verduras. Preparación: cocinar y mezclar.'
  },
  {
    title: 'Ensalada fresca (demo)',
    slug: 'ensalada-fresca',
    description: 'Receta demo para tests',
    public: true,
    content: 'Mezclar verduras y aliñar.'
  }
];

async function seed() {
  console.log('Seeding E2E demo recipes...');
  for (const r of sampleRecipes) {
    try {
      const { data, error } = await supabase.from('recipes').upsert(r, { onConflict: 'slug' });
      if (error) {
        console.error('Error upserting recipe', r.slug, error);
      } else {
        console.log('Upserted', r.slug);
      }
    } catch (err) {
      console.error('Seed error', err?.message || err);
    }
  }
  console.log('Seeding finished.');
}

seed();
