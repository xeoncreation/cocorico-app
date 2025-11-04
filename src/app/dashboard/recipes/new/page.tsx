"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RecipeForm from "@/components/recipes/RecipeForm";
import type { RecipeInput } from "@/schemas/recipe";

export default function NewRecipePage() {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function onSubmit(data: RecipeInput) {
    setSaving(true);
    const res = await fetch("/api/recipes", { method: "POST", body: JSON.stringify(data) });
    const json = await res.json();
    setSaving(false);
    if (json.recipe) router.push(`/r/me/${json.recipe.slug}`);
    else alert(json.error || "Error al guardar");
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-display text-cocorico-red mb-4">Nueva receta</h1>
      <RecipeForm onSubmit={onSubmit} submitting={saving} />
    </main>
  );
}
