'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Recipe, Visibility } from '@/types/recipes';

export default function RecipeForm({ recipe }: { recipe?: Recipe }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    content: recipe?.content || '',
    visibility: recipe?.visibility || Visibility.PRIVATE
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean the recipe content first
      const cleanResponse = await fetch('/api/recipes/clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: formData.content })
      });

      if (!cleanResponse.ok) {
        throw new Error('Failed to clean recipe');
      }

      const cleanedRecipe = await cleanResponse.json();

      // Save the cleaned recipe
      const { error } = recipe?.id 
        ? await supabase
            .from('recipes')
            .update({
              title: formData.title,
              content: JSON.stringify(cleanedRecipe),
              visibility: formData.visibility,
              updated_at: new Date().toISOString()
            })
            .eq('id', recipe.id)
        : await supabase
            .from('recipes')
            .insert([{
              title: formData.title,
              content: JSON.stringify(cleanedRecipe),
              visibility: formData.visibility
            }]);

      if (error) throw error;
      router.push('/recipes');
      router.refresh();
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error al guardar la receta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {recipe ? 'Editar Receta' : 'Nueva Receta'}
      </h1>

      <div className="space-y-4">
        <div>
          <label htmlFor="recipe-title" className="block text-sm font-medium mb-1">
            Título
          </label>
          <input
            id="recipe-title"
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Contenido
          </label>
          <textarea
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-2 border rounded min-h-[200px]"
            required
            placeholder="Escribe aquí tu receta..."
          />
        </div>

        <div>
          <label htmlFor="recipe-visibility" className="block text-sm font-medium mb-1">
            Visibilidad
          </label>
          <select
            id="recipe-visibility"
            value={formData.visibility}
            onChange={e => setFormData({ 
              ...formData, 
              visibility: e.target.value as Visibility 
            })}
            className="w-full p-2 border rounded"
          >
            <option value={Visibility.PRIVATE}>Privada</option>
            <option value={Visibility.PUBLIC}>Pública</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}