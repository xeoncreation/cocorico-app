"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RecipeForm from "@/components/recipes/RecipeForm";
import type { RecipeInput } from "@/schemas/recipe";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Partial<RecipeInput>>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/recipes/${params.id}`);
      const json = await res.json();
      if (json.recipe) {
        setInitial({
          title: json.recipe.title,
          description: json.recipe.description,
          ingredients: json.recipe.ingredients || [],
          steps: json.recipe.steps || [],
          time_minutes: json.recipe.time_minutes || 20,
          difficulty: json.recipe.difficulty || "fácil",
          visibility: json.recipe.visibility || "private",
          image_url: json.recipe.image_url || "",
        });
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function onSubmit(data: RecipeInput) {
    setSaving(true);
    const res = await fetch(`/api/recipes/${params.id}`, { method: "PUT", body: JSON.stringify(data) });
    const json = await res.json();
    setSaving(false);
    if (json.recipe) router.push(`/r/me/${json.recipe.slug}`);
    else alert(json.error || "Error al guardar");
  }

  if (loading) return <main className="p-6">Cargando…</main>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-display text-cocorico-red mb-4">Editar receta</h1>
      <RecipeForm defaultValues={initial} onSubmit={onSubmit} submitting={saving} />
    </main>
  );
}
