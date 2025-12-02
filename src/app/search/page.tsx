"use client";
import { useEffect, useMemo, useState } from "react";
import Wallpaper from "@/components/layout/Wallpaper";
import RecipeCard from "@/components/RecipeCard";
import SearchFilters, { SearchFilterState } from "@/components/search/SearchFilters";
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";

type Recipe = {
  id: number | string;
  title: string;
  slug: string;
  image_url?: string;
  difficulty?: "fácil" | "media" | "difícil";
  time_minutes?: number;
  description?: string;
};

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: "r1",
    title: "Pasta con verduras",
    slug: "pasta-con-verduras",
    time_minutes: 25,
    difficulty: "fácil",
    description: "Pasta salteada con verduras frescas.",
  },
  {
    id: "r2",
    title: "Test Recipe",
    slug: "test-recipe",
    time_minutes: 15,
    difficulty: "media",
    description: "Receta de ejemplo usada en pruebas.",
  },
  {
    id: "r3",
    title: "Pasta Recipe",
    slug: "pasta-recipe",
    time_minutes: 20,
    difficulty: "fácil",
    description: "Receta demo para flujos públicos.",
  },
];

const normalizeApiRecipe = (item: any): Recipe => ({
  id: item.id ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
  title: item.title ?? "Receta",
  slug: item.slug ?? String(item.id ?? "receta"),
  image_url: item.image_url ?? undefined,
  difficulty: item.difficulty ?? undefined,
  time_minutes: item.total_time ?? item.time_minutes ?? item.time ?? undefined,
  description: item.description ?? undefined,
});

const filterSampleRecipes = (q: string, filters: SearchFilterState) => {
  const term = q.trim().toLowerCase();
  return SAMPLE_RECIPES.filter((recipe) => {
    const matchesQuery = term
      ? recipe.title.toLowerCase().includes(term) || recipe.description?.toLowerCase().includes(term)
      : true;
    const matchesTime = filters.maxTime ? (recipe.time_minutes ?? 0) <= filters.maxTime : true;
    const matchesDifficulty = filters.difficulty.length
      ? filters.difficulty.includes(recipe.difficulty === "difícil" ? "hard" : recipe.difficulty === "media" ? "medium" : "easy")
      : true;
    return matchesQuery && matchesTime && matchesDifficulty;
  });
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

  useEffect(() => {
    if (typeof document === "undefined") return;
    const detectedPlan = (document.documentElement.dataset.theme as "free" | "premium" | undefined) ?? "free";
    setPlan(detectedPlan);
  }, []);

  const fallbackResults = useMemo(() => filterSampleRecipes(q, filters), [q, filters]);

  // Example: fetch results when filters change
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (filters.maxTime) params.set("maxTime", String(filters.maxTime));
        if (filters.difficulty[0]) params.set("difficulty", filters.difficulty[0]);
        if (filters.diets[0]) params.set("diet", filters.diets[0]);
        const res = await fetch(`/api/recipes/search?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Search request failed: ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const payload = Array.isArray(data.recipes)
          ? data.recipes
          : Array.isArray(data.results)
            ? data.results
            : [];
        const normalized = payload.map(normalizeApiRecipe);
        if (normalized.length === 0) {
          setResults(fallbackResults);
          setTotal(fallbackResults.length);
        } else {
          setResults(normalized);
          setTotal(normalized.length);
        }
      } catch (err) {
        if (cancelled) return;
        console.warn("Search request failed, using fallback dataset", err);
        setResults(fallbackResults);
        setTotal(fallbackResults.length);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [q, filters, plan, fallbackResults]);

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
