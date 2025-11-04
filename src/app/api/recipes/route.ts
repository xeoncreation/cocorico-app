import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase-client";
import { slugify } from "@/utils/slugify";

export async function GET() {
  const sb = supabaseServer;
  if (!sb) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ recipes: [] });

  const { data, error } = await sb
    .from("recipes")
    .select("id,title,slug,visibility,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ recipes: data || [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: "No auth" }, { status: 401 });

    const slug = slugify(body.title);
    const { data, error } = await sb
      .from("recipes")
      .insert({
        user_id: user.id,
        title: body.title,
        slug,
        description: body.description ?? null,
        ingredients: body.ingredients ?? [],
        steps: body.steps ?? [],
        time_minutes: body.time_minutes ?? null,
        difficulty: body.difficulty ?? "fácil",
        visibility: body.visibility ?? "private",
        image_url: body.image_url ?? null
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ recipe: data });
  } catch (e: any) {
    console.error("POST /api/recipes error", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}