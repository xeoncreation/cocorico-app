import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@/lib/supabase/client";

export async function GET(req: Request) {
  try {
    const supabase = await createRouteHandlerClient();
    const { searchParams } = new URL(req.url);
    const baseId = searchParams.get("base");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ rows: [] });
    }

    const { data, error } = await supabase
      .from("recipe_versions")
      .select("id, variant_type, content, created_at")
      .eq("user_id", user.id)
      .eq("base_recipe_id", baseId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ rows: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
