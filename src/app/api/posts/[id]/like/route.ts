import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Supabase no disponible" }, { status: 500 });
    }

    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const postId = parseInt(params.id);

    // Check if already liked
    const { data: existing } = await supabaseServer
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      // Unlike
      await supabaseServer
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      return NextResponse.json({ liked: false });
    } else {
      // Like
      await supabaseServer
        .from("post_likes")
        .insert({
          post_id: postId,
          user_id: user.id,
        });

      return NextResponse.json({ liked: true });
    }
  } catch (err: any) {
    console.error("Error en like:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
