import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
  const { data, error } = await supabase
    .from("user_badges")
    .select("earned_at,badges(code,name,description,icon)")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ badges: data }), { status: 200 });
}
