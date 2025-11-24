"use client";
import { useEffect, useMemo, useState } from "react";
import Wallpaper from "@/components/layout/Wallpaper";
import RecipeCard from "@/components/RecipeCard";
import SearchFilters, { SearchFilterState } from "@/components/search/SearchFilters";
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";

type Recipe = {
  id: number;
  return (
    <>
      <Wallpaper
        imageLight="/branding/SEARCH_MODO_CLARO.jpg"
        imageDark="/branding/SEARCH_MODO_OSCURO.jpg"
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
                      {...r}
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
  }, [q, filters, page]);

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
      const diets0 = search.get("diets");
      const max0 = search.get("maxTime");
      const page0 = search.get("page");
      
      if (q0) setQ(q0);
      
      setFilters((prev) => ({
        ...prev,
        ingredients: ingr0 ? ingr0.split(",").map((s) => s.trim()).filter(Boolean) : [],
        difficulty: diff0 ? diff0.split(",").map((s) => s.trim()).filter(Boolean) : [],
        diets: diets0 ? diets0.split(",").map((s) => s.trim()).filter(Boolean) : [],
        maxTime: max0 && !Number.isNaN(Number(max0)) ? Number(max0) : 120,
      }));
      
      if (page0 && !Number.isNaN(Number(page0))) setPage(Math.max(1, Number(page0)));
    } catch {}
  }, []);

  return (
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
    </LegacyPageWrapper>
  );
}
