import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ profile: data }), { status: 200 });
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  }

  const body = await req.json();

  const { error } = await supabase.from("user_profiles").upsert({
    id: user.id,
    display_name: body.display_name,
    bio: body.bio,
    instagram: body.instagram,
    tiktok: body.tiktok,
    visibility: body.visibility,
    avatar_url: body.avatar_url,
    goal: body.goal,
    diet: body.diet,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
