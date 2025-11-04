import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { event, recipe_id, recipe_slug } = await req.json();
    const supabase = createServerComponentClient({ cookies });
    
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
