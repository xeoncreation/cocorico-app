import { createRouteHandlerClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const { category, title, message, screenshot_url } = await req.json();
  if (!category || !title || !message) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  const { error } = await supabase.from("feedback_tickets").insert({
    user_id: user.id,
    category,
    title,
    message,
    screenshot_url: screenshot_url || null,
  });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
