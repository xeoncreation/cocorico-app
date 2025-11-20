import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { baseId, variantType, content } = await req.json();
    const supabase = createRouteHandlerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { error } = await supabase.from("recipe_versions").insert({
      base_recipe_id: baseId,
      user_id: user.id,
      variant_type: variantType ?? "IA",
      content,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
