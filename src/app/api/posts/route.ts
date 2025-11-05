import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";

// GET: List recent posts
export async function GET(req: Request) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Supabase no disponible" }, { status: 500 });
    }

    const { data: posts, error } = await supabaseServer
      .from("posts")
      .select(`
        id,
        user_id,
        image_url,
        description,
        created_at,
        post_likes (count),
        post_comments (count)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts });
  } catch (err: any) {
    console.error("Error en GET /api/posts:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST: Create new post
export async function POST(req: Request) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Supabase no disponible" }, { status: 500 });
    }

    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { image_url, description } = await req.json();

    if (!image_url && !description) {
      return NextResponse.json(
        { error: "Se requiere imagen o descripción" },
        { status: 400 }
      );
    }

    const { data: post, error } = await supabaseServer
      .from("posts")
      .insert({
        user_id: user.id,
        image_url,
        description,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating post:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Award XP for creating a post
    await fetch(`${req.url.replace("/api/posts", "/api/gamify")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "recipe_created" }),
    });

    return NextResponse.json({ post });
  } catch (err: any) {
    console.error("Error en POST /api/posts:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
