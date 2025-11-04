import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  try {
    const { recipeId } = await req.json();
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Ver si ya existe el favorito
    const { data: exists } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .eq("recipe_id", recipeId)
      .maybeSingle();

    if (exists) {
      // Eliminar favorito
      await supabase.from("favorites").delete().eq("id", exists.id);
      return NextResponse.json({ isFavorite: false });
    }

    // Añadir favorito
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, recipe_id: recipeId });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ isFavorite: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
