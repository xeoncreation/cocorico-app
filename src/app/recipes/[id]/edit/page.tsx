'use client';

import Wallpaper from "@/components/layout/Wallpaper";
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase/client';
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
    return (
      <>
        <Wallpaper
          imageLight="/branding/EDITAR_RECETA_MODO_CLARO.jpg"
          imageDark="/branding/EDITAR_RECETA_MODO_OSCURO.jpg"
        />
        <div className="p-4">Cargando...</div>
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <Wallpaper
          imageLight="/branding/EDITAR_RECETA_MODO_CLARO.jpg"
          imageDark="/branding/EDITAR_RECETA_MODO_OSCURO.jpg"
        />
        <div className="p-4">Receta no encontrada</div>
      </>
    );
  }

  return (
    <>
      <Wallpaper
        imageLight="/branding/EDITAR_RECETA_MODO_CLARO.jpg"
        imageDark="/branding/EDITAR_RECETA_MODO_OSCURO.jpg"
      />
      <RecipeForm recipe={recipe} />
    </>
  );
}