import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@/lib/supabase/client";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createRouteHandlerClient();
  const { data, error } = await supabase
    .from("community_comments")
    .select("id, user_id, content, created_at")
    .eq("post_id", params.id)
    .order("created_at", { ascending: false });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ comments: data }), { status: 200 });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  const body = await request.json();
  const content = String(body.content || "").trim();
  if (!content) return new Response(JSON.stringify({ error: "Content required" }), { status: 400 });
  const { error } = await supabase.from("community_comments").insert({ post_id: params.id, user_id: user.id, content });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ success: true }), { status: 201 });
}
