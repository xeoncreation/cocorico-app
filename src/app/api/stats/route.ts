import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createRouteHandlerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { event, recipe_id, recipe_slug } = await req.json();
    const supabase = createRouteHandlerClient();
    
    await supabase.from("stats").insert({ 
      event, 
      recipe_id: recipe_id || null,
      metadata: { slug: recipe_slug }
    });
    
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
