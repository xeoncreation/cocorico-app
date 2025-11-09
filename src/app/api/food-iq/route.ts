import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "name parameter required" }, { status: 400 });
  }

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar por common_name (case-insensitive) o aliases
    const { data, error } = await supabase
      .from("food_iq")
      .select("*")
      .or(`common_name.ilike.%${name}%,aliases.cs.{${name}}`);

    if (error) throw error;

    return NextResponse.json({ items: data || [] });
  } catch (e: any) {
    console.error("Food-IQ query error:", e);
    return NextResponse.json({ error: "Query failed", detail: e.message }, { status: 500 });
  }
}
