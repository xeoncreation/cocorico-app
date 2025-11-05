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

    const { comment } = await req.json();

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json({ error: "El comentario no puede estar vacío" }, { status: 400 });
    }

    const postId = parseInt(params.id);

    const { data, error } = await supabaseServer
      .from("post_comments")
      .insert({
        post_id: postId,
        user_id: user.id,
        comment: comment.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating comment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comment: data });
  } catch (err: any) {
    console.error("Error en comment:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Supabase no disponible" }, { status: 500 });
    }

    const postId = parseInt(params.id);

    const { data: comments, error } = await supabaseServer
      .from("post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comments });
  } catch (err: any) {
    console.error("Error en GET comments:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
