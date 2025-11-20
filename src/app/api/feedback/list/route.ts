import { createRouteHandlerClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";

export async function GET() {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const { data, error } = await supabase
    .from("feedback_tickets")
    .select("id, category, title, message, status, votes, created_at")
    .order("created_at", { ascending: false });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ tickets: data }), { status: 200 });
}
