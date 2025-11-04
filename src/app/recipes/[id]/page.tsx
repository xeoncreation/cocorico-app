'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Recipe } from '@/types/recipes';
import FavoriteButton from '@/components/FavoriteButton';
import RecipeVersions from '@/components/RecipeVersions';

export default function RecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
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

  const recipeData = JSON.parse(recipe.content);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-600"
        >
          ← Volver
        </button>
      </div>

      <article className="space-y-6">
        <header>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
              <p className="text-gray-600">{recipeData.description}</p>
            </div>
            <div className="ml-4">
              <FavoriteButton recipeId={recipe.id} />
            </div>
          </div>
        </header>

        <section>
          <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 p-4 rounded">
            <div>
              <p className="text-gray-600">Tiempo de preparación</p>
              <p className="font-semibold">{recipeData.prepTime} minutos</p>
            </div>
            <div>
              <p className="text-gray-600">Tiempo de cocción</p>
              <p className="font-semibold">{recipeData.cookTime} minutos</p>
            </div>
            <div>
              <p className="text-gray-600">Porciones</p>
              <p className="font-semibold">{recipeData.servings}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Ingredientes</h2>
          <ul className="list-disc list-inside space-y-2">
            {recipeData.ingredients.map((ing: any, i: number) => (
              <li key={i}>
                {ing.amount} {ing.unit} {ing.item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Instrucciones</h2>
          <ol className="list-decimal list-inside space-y-4">
            {recipeData.instructions.map((step: string, i: number) => (
              <li key={i} className="pl-4">
                {step}
              </li>
            ))}
          </ol>
        </section>

        {recipeData.notes && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Notas</h2>
            <p className="text-gray-600">{recipeData.notes}</p>
          </section>
        )}

        <RecipeVersions baseId={recipe.id} />
      </article>
    </div>
  );
}