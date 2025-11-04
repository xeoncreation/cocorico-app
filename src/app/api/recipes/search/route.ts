import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    const ing = (url.searchParams.get("ingredients") || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
    const maxTime = url.searchParams.get("maxTime");
    const difficulty = url.searchParams.get("difficulty");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = 12;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from("recipes")
      .select("*", { count: "exact" })
      .eq("visibility", "public");

    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }
    if (ing.length) {
      query = query.contains("ingredients", ing);
    }
    if (maxTime) {
      query = query.lte("time_minutes", Number(maxTime));
    }
    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return NextResponse.json({
      results: data ?? [],
      page,
      pageSize,
      total: count ?? 0,
    });
  } catch (err: any) {
    console.error("/api/recipes/search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}