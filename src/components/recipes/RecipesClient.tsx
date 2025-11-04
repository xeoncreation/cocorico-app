'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Recipe, Visibility } from '@/types/recipes';

export default function RecipesClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const locale = useLocale();

  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Inserta recetas demo si la tabla está vacía
  useEffect(() => {
    if (!loading && recipes.length === 0) {
      insertDemoRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const insertDemoRecipes = async () => {
    const demo = [
      {
        title: 'Tarta de Manzana',
        description: 'Clásica tarta casera con manzanas frescas.',
        content: JSON.stringify({
          title: 'Tarta de Manzana',
          description: 'Clásica tarta casera con manzanas frescas.',
          prepTime: '20 min',
          cookTime: '45 min',
          servings: 8,
          ingredients: [
            { item: 'Manzanas', amount: '4', unit: 'unidades' },
            { item: 'Harina', amount: '250', unit: 'g' },
            { item: 'Azúcar', amount: '150', unit: 'g' },
            { item: 'Huevos', amount: '2', unit: 'unidades' }
          ],
          instructions: [
            'Pelar y cortar las manzanas.',
            'Mezclar harina, azúcar y huevos.',
            'Agregar las manzanas y hornear 45 min a 180°C.'
          ]
        }),
        visibility: Visibility.PUBLIC
      },
      {
        title: 'Ensalada César',
        description: 'Ensalada fresca con pollo y aderezo César.',
        content: JSON.stringify({
          title: 'Ensalada César',
          description: 'Ensalada fresca con pollo y aderezo César.',
          prepTime: '15 min',
          cookTime: '10 min',
          servings: 2,
          ingredients: [
            { item: 'Lechuga', amount: '1', unit: 'unidad' },
            { item: 'Pollo', amount: '150', unit: 'g' },
            { item: 'Queso parmesano', amount: '30', unit: 'g' },
            { item: 'Crutones', amount: '50', unit: 'g' }
          ],
          instructions: [
            'Cocinar el pollo y cortar en tiras.',
            'Mezclar todos los ingredientes y añadir aderezo.'
          ]
        }),
        visibility: Visibility.PUBLIC
      },
      {
        title: 'Tortilla de Patatas',
        description: 'Receta tradicional española de tortilla.',
        content: JSON.stringify({
          title: 'Tortilla de Patatas',
          description: 'Receta tradicional española de tortilla.',
          prepTime: '10 min',
          cookTime: '25 min',
          servings: 4,
          ingredients: [
            { item: 'Patatas', amount: '3', unit: 'unidades' },
            { item: 'Huevos', amount: '4', unit: 'unidades' },
            { item: 'Cebolla', amount: '1', unit: 'unidad' }
          ],
          instructions: [
            'Pelar y cortar las patatas y cebolla.',
            'Freír y mezclar con los huevos.',
            'Cocinar en sartén hasta dorar.'
          ]
        }),
        visibility: Visibility.PUBLIC
      }
    ];
    try {
      await supabase.from('recipes').insert(demo);
      loadRecipes();
    } catch (e) {
      console.error('Error insertando recetas demo:', e);
    }
  };

  const loadRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Cargando recetas...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Recetas</h1>
        <button
          onClick={() => router.push(`/${locale}/recipes/new`)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Nueva Receta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {recipe.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {recipe.visibility === Visibility.PUBLIC ? 'Pública' : 'Privada'}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => router.push(`/${locale}/recipes/${recipe.id}`)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Ver
                </button>
                <button
                  onClick={() => router.push(`/${locale}/recipes/${recipe.id}/edit`)}
                  className="text-green-500 hover:text-green-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de eliminar esta receta?')) {
                      deleteRecipe(recipe.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center mt-10">
          <p className="text-gray-600">No hay recetas todavía.</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/recipes/new`}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Crear receta
            </Link>
            <Link
              href={`/${locale}/dashboard/import`}
              className="inline-block border border-amber-300 text-amber-800 hover:bg-amber-50 px-4 py-2 rounded"
            >
              Importar desde URL/Foto
            </Link>
            <Link
              href={`/${locale}/recipes/search`}
              className="inline-block border text-neutral-700 hover:bg-neutral-50 px-4 py-2 rounded"
            >
              Buscar recetas
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
