import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  const body = await req.json();
  const target = body.target_id as string;
  const action = body.action as "follow" | "unfollow";
  if (!target || target === user.id) return new Response(JSON.stringify({ error: "Invalid target" }), { status: 400 });
  if (action === "follow") {
    const { error } = await supabase.from("community_follows").upsert({ follower: user.id, following: target });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  } else if (action === "unfollow") {
    const { error } = await supabase.from("community_follows").delete().eq("follower", user.id).eq("following", target);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  } else {
    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
