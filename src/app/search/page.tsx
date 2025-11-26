"use client";
import { useEffect, useMemo, useState } from "react";
import Wallpaper from "@/components/layout/Wallpaper";
import RecipeCard from "@/components/RecipeCard";
import SearchFilters, { SearchFilterState } from "@/components/search/SearchFilters";
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";

type Recipe = {
  id: number;
  title: string;
  slug: string;
  image_url?: string;
  difficulty?: "fácil" | "media" | "difícil";
  time_minutes?: number;
  description?: string;
};

export default function SearchPage() {
  // Add necessary state and logic here
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<SearchFilterState>({
    maxTime: 120,
    difficulty: [],
    diets: [],
    ingredients: [],
  });
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);

  // Example: fetch results when filters change
  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        // Replace with actual query string logic
        const queryString = '';
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
  }, [q, filters, plan]);

  return (
    <>
      <Wallpaper
        imageLight="/branding/SEARCH - BÚSQUEDA — Especias y hierbas, modo claro.png"
        imageDark="/branding/SEARCH - BÚSQUEDA — Especias en mesa, modo oscuro.png"
      />
      <LegacyPageWrapper>
        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-display text-cocorico-red mb-4">Buscar recetas</h1>
          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
            />
          </div>
          <SearchFilters
            value={filters}
            onChange={setFilters}
            plan={plan}
          />
          <div className="mt-6">
            {loading ? <p>Cargando…</p> : (
              <>
                <p className="text-sm text-neutral-500 mb-3">{total} resultados</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map(r => (
                    <RecipeCard 
                      key={r.id}
                      title={r.title || "Receta"}
                      slug={r.slug || r.id.toString()}
                      image={r.image_url}
                      difficulty={r.difficulty as "fácil" | "media" | "difícil" | undefined}
                      time={r.time_minutes}
                      excerpt={r.description}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </LegacyPageWrapper>
    </>
  );
}
