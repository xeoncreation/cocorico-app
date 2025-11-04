'use client';

import { useState } from "react";

export default function SearchRecipesPage() {
  const [term, setTerm] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const params = new URLSearchParams();
    if (term) params.append("term", term);
    if (difficulty) params.append("difficulty", difficulty);
    if (maxTime) params.append("maxTime", maxTime);

    try {
      const res = await fetch(`/api/recipes/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.recipes || []);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Buscar recetas</h1>

      <div className="flex flex-col md:flex-row gap-2">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Ingrediente o palabra clave..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          aria-label="Buscar recetas"
        />
        <select
          className="border rounded px-3 py-2"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          aria-label="Filtrar por dificultad"
        >
          <option value="">Cualquier dificultad</option>
          <option value="fácil">Fácil</option>
          <option value="media">Media</option>
          <option value="difícil">Difícil</option>
        </select>
        <input
          type="number"
          className="border rounded px-3 py-2 w-32"
          placeholder="Tiempo (min)"
          value={maxTime}
          onChange={(e) => setMaxTime(e.target.value)}
          aria-label="Tiempo máximo"
        />
        <button
          onClick={search}
          className="px-4 py-2 bg-black text-white rounded hover:bg-neutral-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Buscando…" : "Buscar"}
        </button>
      </div>

      <section className="space-y-2">
        {results.map((r) => (
          <a
            key={r.id}
            href={`/r/${r.user_id}/${r.slug}`}
            className="block border rounded p-3 hover:bg-neutral-50 transition"
          >
            <h2 className="font-medium">{r.title}</h2>
            <p className="text-sm text-neutral-500">
              {r.difficulty || "Sin dificultad"} •{" "}
              {r.time ? `${r.time} min` : "sin tiempo"}
            </p>
          </a>
        ))}
      </section>
    </main>
  );
}