"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase as supabaseClient } from "@/app/lib/supabase-client";
import { Search, SlidersHorizontal, Loader2, Mic, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchFilters, { SearchFilterState } from "@/components/search/SearchFilters";
import { cn } from "@/lib/utils";

type Recipe = {
  id: string;
  title: string;
  image_url?: string | null;
  total_time_minutes?: number | null;
  difficulty?: string | null;
  diet_tags?: string[] | null;
  favorites_count?: number | null;
};

const PAGE_SIZE = 12;

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilterState>({
    difficulty: [],
    maxTime: 120,
    diets: [],
    ingredients: [],
  });
  const [sort, setSort] = useState<"relevance" | "newest" | "popular">("relevance");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);
  const plan = typeof document !== "undefined"
    ? (document.documentElement.dataset.theme as "free" | "premium")
    : "free";

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total]
  );

  const fetchResults = async () => {
    setLoading(true);
    try {
      const sb = supabaseClient as any;
      if (!sb || !sb.from) {
        console.warn("Supabase no configurado: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY ausentes");
        setResults([]);
        setTotal(0);
        return;
      }

      let q = sb
        .from("recipes")
        .select("*", { count: "exact" })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (query.length > 0) {
        q = q.ilike("title", `%${query}%`);
      }

      if (filters.maxTime) q = q.lte("total_time_minutes", filters.maxTime);
      if (filters.difficulty.length) q = q.in("difficulty", filters.difficulty);
      filters.diets.forEach((d) => {
        q = q.contains("diet_tags", [d]);
      });
      filters.ingredients.forEach((i) => {
        q = q.ilike("ingredients_text", `%${i}%`);
      });

      if (sort === "newest") q = q.order("created_at", { ascending: false });
      if (sort === "popular") q = q.order("favorites_count", { ascending: false });

      const { data, count, error } = await q;
      if (error) console.error(error);

      setResults((data as Recipe[]) ?? []);
      setTotal(count ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, sort]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    setPage(1);
    fetchResults();
  };

  return (
    <section className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-3">
        {/* Barra de búsqueda */}
        <div
          className={cn(
            "flex flex-col md:flex-row gap-3 p-3 rounded-2xl border shadow",
            plan === "premium" &&
              "bg-white/10 backdrop-blur-xl border-white/20 shadow-lg"
          )}
        >
          <div className="flex items-center gap-3 flex-1 bg-surface rounded-xl px-3 py-2 border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              className="border-0 shadow-none"
              placeholder="Buscar por nombre o ingrediente…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="icon" className="rounded-xl">
              <Mic className="w-4 h-4" />
            </Button>

            <Button type="button" variant="outline" size="icon" className="rounded-xl">
              <ImageIcon className="w-4 h-4" />
            </Button>

            <Button className="rounded-xl" type="submit">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <SearchFilters value={filters} onChange={setFilters} plan={plan} />

        {/* Ordenamiento */}
        <div className="flex gap-2 text-xs">
          {["relevance", "newest", "popular"].map((opt) => (
            <button
              key={opt}
              type="button"
              className={cn(
                "px-3 py-1 rounded-full border text-muted-foreground",
                sort === opt && "bg-primary/10 text-primary border-primary"
              )}
              onClick={() => setSort(opt as any)}
            >
              {opt === "relevance" && "Relevancia"}
              {opt === "newest" && "Más recientes"}
              {opt === "popular" && "Populares"}
            </button>
          ))}
        </div>
      </form>

      {/* Resultados */}
      <section className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {total > 0 ? `Se encontraron ${total} recetas` : "Sin resultados."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((r) => (
            <a
              key={r.id}
              href={`/recipes/${r.id}`}
              className={cn(
                "rounded-2xl overflow-hidden border bg-surface transition hover:scale-[1.01]",
                plan === "premium" &&
                  "bg-white/10 border-white/20 backdrop-blur-xl shadow-lg"
              )}
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.image_url ?? ""}
                  className="w-full h-full object-cover"
                  alt={r.title}
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="font-semibold text-sm">{r.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {(r.total_time_minutes ?? 0)} min • {r.difficulty ?? "—"}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span className="text-xs text-muted-foreground">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </section>
    </section>
  );
}
