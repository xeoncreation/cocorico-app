// src/app/api/recipes/search/route.ts
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const maxTime = searchParams.get("maxTime");
  const difficulty = searchParams.get("difficulty");
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
}
