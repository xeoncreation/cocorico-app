import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase-client";
import { slugify } from "@/utils/slugify";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const sb = supabaseServer;
  if (!sb) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  const { data, error } = await sb
    .from("recipes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ recipe: data });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const fields: any = { 
      title: body.title,
      slug: slugify(body.title),
      description: body.description ?? null,
      ingredients: body.ingredients ?? [],
      steps: body.steps ?? [],
      time_minutes: body.time_minutes ?? null,
      difficulty: body.difficulty ?? "fácil",
      visibility: body.visibility ?? "private",
      image_url: body.image_url ?? null,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await sb
      .from("recipes")
      .update(fields)
      .eq("id", params.id)
      .select("*")
      .single();

    if (error) throw error;
    return NextResponse.json({ recipe: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const sb = supabaseServer;
  if (!sb) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { error } = await sb.from("recipes").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}