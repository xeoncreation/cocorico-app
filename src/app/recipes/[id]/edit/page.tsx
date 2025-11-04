'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Recipe } from '@/types/recipes';
import RecipeForm from '@/components/RecipeForm';

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setRecipe(data);
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [params.id]);

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (!recipe) {
    return <div className="p-4">Receta no encontrada</div>;
  }

  return <RecipeForm recipe={recipe} />;
}