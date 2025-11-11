import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name")?.trim();
  
  if (!name) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }

  if (!supabaseServer) {
    return NextResponse.json(
      { error: "Supabase not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." },
      { status: 500 }
    );
  }

  try {
    // Busca por nombre o alias (case-insensitive)
    const { data, error } = await supabaseServer
      .from("food_iq")
      .select("*")
      .or(`common_name.ilike.%${name}%,aliases.cs.{${name}}`)
      .limit(5);

    if (error) {
      console.error("Food-IQ query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data || [] });
  } catch (e: any) {
    console.error("Food-IQ unexpected error:", e);
    return NextResponse.json({ error: "Query failed", detail: e.message }, { status: 500 });
  }
}
