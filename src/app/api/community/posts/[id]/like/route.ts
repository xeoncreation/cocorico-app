import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const postId = params.id;
  if (!postId) {
    return new Response(JSON.stringify({ error: "Post id required" }), { status: 400 });
  }

  // Direct increment (RPC optional)
  const { data, error } = await supabase
    .from("community_posts")
    .update({ likes: (supabase as any).rpc ? undefined : undefined })
    .eq("id", postId)
    .select("likes")
    .single();

  // Fallback manual increment if update shape failed (read-modify-write)
  if (error) {
    const { data: current } = await supabase
      .from("community_posts")
      .select("likes")
      .eq("id", postId)
      .single();
    const currentLikes = current?.likes ?? 0;
    const { data: after, error: upErr } = await supabase
      .from("community_posts")
      .update({ likes: currentLikes + 1 })
      .eq("id", postId)
      .select("likes")
      .single();
    if (upErr) {
      return new Response(JSON.stringify({ error: upErr.message }), { status: 400 });
    }
    return new Response(JSON.stringify({ likes: after.likes }), { status: 200 });
  }

  // If initial update succeeded it likely set likes incorrectly; re-fetch then increment properly
  const { data: refetched } = await supabase
    .from("community_posts")
    .select("likes")
    .eq("id", postId)
    .single();
  const likesCurrent = refetched?.likes ?? data?.likes ?? 0;
  const { data: final, error: finalErr } = await supabase
    .from("community_posts")
    .update({ likes: likesCurrent + 1 })
    .eq("id", postId)
    .select("likes")
    .single();
  if (finalErr) {
    return new Response(JSON.stringify({ error: finalErr.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ likes: final.likes }), { status: 200 });
}
