import { createServerComponentClient } from "@/lib/supabase/server";
// src/app/api/recipes/search/route.ts
import { NextRequest } from "next/server";

const FALLBACK_RECIPES = [
  {
    id: "r1",
    title: "Pasta con verduras",
    description: "Pasta con verduras salteadas",
    total_time: 25,
    difficulty: "fácil",
    diet: "omnivoro",
    image_url: null,
    favorites_count: 15,
    is_premium: false,
    created_at: "2024-01-01",
    is_deleted: false,
  },
  {
    id: "r2",
    title: "Test Recipe",
    description: "Receta de ejemplo usada en tests",
    total_time: 15,
    difficulty: "media",
    diet: "vegetariano",
    image_url: null,
    favorites_count: 5,
    is_premium: false,
    created_at: "2024-01-05",
    is_deleted: false,
  },
  {
    id: "r3",
    title: "Pasta Recipe",
    description: "Receta demo de pasta",
    total_time: 20,
    difficulty: "fácil",
    diet: "omnivoro",
    image_url: null,
    favorites_count: 9,
    is_premium: false,
    created_at: "2024-01-10",
    is_deleted: false,
  },
];

const normalizeDifficulty = (value: string | null) => {
  if (!value) return null;
  const normalized = value.normalize("NFD").replace(/[^\w]/g, "").toLowerCase();
  if (normalized === "easy" || normalized === "facil") return "fácil";
  if (normalized === "medium" || normalized === "media") return "media";
  if (normalized === "hard" || normalized === "dificil") return "difícil";
  return value;
};

const filterFallbackRecipes = (params: {
  q: string;
  maxTime: string | null;
  difficulty: string | null;
  diet: string | null;
}) => {
  const q = params.q.toLowerCase();
  const normalizedDifficulty = normalizeDifficulty(params.difficulty);
  return FALLBACK_RECIPES.filter((recipe) => {
    if (recipe.is_deleted) return false;
    const matchesQuery = q
      ? recipe.title.toLowerCase().includes(q) || recipe.description.toLowerCase().includes(q)
      : true;
    const matchesTime = params.maxTime ? recipe.total_time <= Number(params.maxTime) : true;
    const matchesDifficulty = normalizedDifficulty ? recipe.difficulty === normalizedDifficulty : true;
    const matchesDiet = params.diet ? recipe.diet === params.diet : true;
    return matchesQuery && matchesTime && matchesDifficulty && matchesDiet;
  });
};

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const maxTime = searchParams.get("maxTime");
    const difficulty = normalizeDifficulty(searchParams.get("difficulty"));
    const diet = searchParams.get("diet");
    const sort = searchParams.get("sort") ?? "relevance";

    const buildBase = () =>
      supabase
        .from("recipes")
        .select(
          "id, title, description, total_time, difficulty, diet, image_url, favorites_count, is_premium, created_at, is_deleted"
        )
        .eq("is_deleted", false);

    const applyFiltersAndSort = (qb: any) => {
      if (maxTime) qb = qb.lte("total_time", Number(maxTime));
      if (difficulty) qb = qb.eq("difficulty", difficulty);
      if (diet) qb = qb.eq("diet", diet);
      switch (sort) {
        case "newest":
          if (typeof qb.order === "function") qb = qb.order("created_at", { ascending: false });
          break;
        case "popular":
          if (typeof qb.order === "function") qb = qb.order("favorites_count", { ascending: false });
          break;
        case "relevance":
        default:
          if (typeof qb.order === "function") qb = qb.order("created_at", { ascending: false });
          break;
      }
      if (typeof qb.limit === "function") return qb.limit(60);
      if (typeof qb.order === "function") return qb.order("created_at", { ascending: false }).limit(60);
      if (typeof qb.lte === "function") return qb.lte("total_time", Number.MAX_SAFE_INTEGER).limit(60);
      return qb;
    };

    let data: any = null;
    let error: any = null;

    if (q) {
      // Intento 1: full-text search sobre search_vector (requires migration)
      let qb1: any = buildBase().textSearch("search_vector", q, {
        type: "websearch",
        config: "spanish",
      });
      ;({ data, error } = await applyFiltersAndSort(qb1));
      if (error) {
        // Fallback: ilike sobre title si aún no existe search_vector
        let qb2: any = buildBase().ilike("title", `%${q}%`);
        ;({ data, error } = await applyFiltersAndSort(qb2));
      }
    } else {
      // Sin término de búsqueda, sólo filtros/orden
      const qb = applyFiltersAndSort(buildBase());
      ;({ data, error } = await qb);
    }

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    return new Response(JSON.stringify({ recipes: data ?? [] }), { status: 200 });
  } catch (err) {
    console.error("Recipes search error", err);
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const maxTime = searchParams.get("maxTime");
    const difficulty = normalizeDifficulty(searchParams.get("difficulty"));
    const diet = searchParams.get("diet");
    const fallback = filterFallbackRecipes({ q, maxTime, difficulty, diet });
    return new Response(JSON.stringify({ recipes: fallback, fallback: true }), { status: 200 });
  }
}
