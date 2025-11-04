"use client";
import { useEffect, useMemo, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import SearchFilters from "@/components/search/SearchFilters";

type Recipe = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  time_minutes: number | null;
  difficulty: string | null;
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (ingredients.length) p.set("ingredients", ingredients.join(","));
    if (difficulty) p.set("difficulty", difficulty);
    if (maxTime) p.set("maxTime", String(maxTime));
    p.set("page", String(page));
    return p.toString();
  }, [q, ingredients, difficulty, maxTime, page]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const res = await fetch(`/api/recipes/search?${queryString}`);
        const data = await res.json();
        if (!cancelled) {
          setResults(data.results || []);
          setTotal(data.total || 0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [queryString]);

  const pageSize = 12;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  // Initialize state from URL params on first mount
  useEffect(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      const q0 = search.get("q");
      const ingr0 = search.get("ingredients");
      const diff0 = search.get("difficulty");
      const max0 = search.get("maxTime");
      const page0 = search.get("page");
      if (q0) setQ(q0);
      if (ingr0) setIngredients(ingr0.split(",").map((s) => s.trim()).filter(Boolean));
      if (diff0) setDifficulty(diff0);
      if (max0 && !Number.isNaN(Number(max0))) setMaxTime(Number(max0));
      if (page0 && !Number.isNaN(Number(page0))) setPage(Math.max(1, Number(page0)));
    } catch {}
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-display text-cocorico-red mb-4">Buscar recetas</h1>
      <SearchFilters
        q={q} setQ={setQ}
        ingredients={ingredients} setIngredients={setIngredients}
        difficulty={difficulty} setDifficulty={setDifficulty}
        maxTime={maxTime} setMaxTime={setMaxTime}
        onSubmit={() => setPage(1)}
      />

      <div className="mt-6">
        {loading ? <p>Cargando…</p> : (
          <>
            <p className="text-sm text-neutral-500 mb-3">{total} resultados</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(r => (
                <RecipeCard 
                  key={r.id} 
                  title={r.title}
                  slug={r.slug}
                  image={r.image_url || undefined}
                  difficulty={r.difficulty as "fácil" | "media" | "difícil" | undefined}
                  time={r.time_minutes || undefined}
                  excerpt={r.description || undefined}
                />
              ))}
            </div>

            {pages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  ← Anterior
                </button>
                <span className="text-sm">{page}/{pages}</span>
                <button
                  disabled={page === pages}
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
