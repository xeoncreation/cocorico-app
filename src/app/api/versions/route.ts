import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { base_recipe_id, variant_type, content } = await req.json();
    const supabase = createServerComponentClient({ cookies });
    
    const { data: { user }, error: uErr } = await supabase.auth.getUser();
    if (uErr || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { error } = await supabase.from("recipe_versions").insert({
      base_recipe_id,
      user_id: user.id,
      variant_type,
      content,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
