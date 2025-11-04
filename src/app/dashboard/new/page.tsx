"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NewRecipePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("fácil");
  const [time, setTime] = useState<number | "">("");
  const [visibility, setVisibility] = useState("private");
  const [ingredientsText, setIngredientsText] = useState("");
  const router = useRouter();

  // Prefill ingredients from Lab (localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cocorico_prefill_ingredients");
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        if (Array.isArray(arr) && arr.length) {
          setIngredientsText(arr.join("\n"));
        }
        localStorage.removeItem("cocorico_prefill_ingredients");
      }
    } catch {}
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Debes iniciar sesión.");

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const { error } = await supabase.from("recipes").insert({
      user_id: user.id,
      title,
      description,
      difficulty,
      time: Number(time) || null,
      visibility,
      slug,
      content_json: {
        ingredients: ingredientsText
          .split(/\n|,/)
          .map((s) => s.trim())
          .filter(Boolean),
        steps: [],
      },
    });

    if (error) return alert("Error al guardar: " + error.message);
    router.push("/dashboard");
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-amber-800">Nueva receta 🥕</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border rounded px-3 py-2 w-full"
          placeholder="Descripción breve"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className="block text-sm text-neutral-600 mb-1">
            Ingredientes (uno por línea)
          </label>
          <textarea
            className="border rounded px-3 py-2 w-full min-h-[120px]"
            placeholder={"tomate\ncebolla\nhuevo"}
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            className="border rounded px-3 py-2 flex-1"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            aria-label="Dificultad"
          >
            <option value="fácil">Fácil</option>
            <option value="media">Media</option>
            <option value="difícil">Difícil</option>
          </select>
          <input
            type="number"
            className="border rounded px-3 py-2 w-32"
            placeholder="Tiempo (min)"
            value={time}
            onChange={(e) => setTime(e.target.value ? Number(e.target.value) : "")}
            aria-label="Tiempo de preparación"
          />
          <select
            className="border rounded px-3 py-2 flex-1"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            aria-label="Visibilidad"
          >
            <option value="private">Privada</option>
            <option value="public">Pública</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
        >
          Guardar
        </button>
      </form>
    </main>
  );
}
