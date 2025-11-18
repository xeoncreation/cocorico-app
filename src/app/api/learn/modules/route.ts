import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const { data: modules, error: e1 } = await supabase
    .from("learn_modules")
    .select("id, slug, title, category, description, level, duration_minutes, cover_image_url")
    .order("created_at", { ascending: true });

  if (e1) return new Response(JSON.stringify({ error: e1.message }), { status: 400 });

  const { data: progress, error: e2 } = await supabase
    .from("module_progress")
    .select("module_id, status, completed_at")
    .eq("user_id", user.id);

  if (e2) return new Response(JSON.stringify({ error: e2.message }), { status: 400 });

  const progressMap = new Map((progress ?? []).map((p: any) => [p.module_id, p]));
  const enriched = (modules ?? []).map((m: any) => ({ ...m, progress: progressMap.get(m.id) ?? null }));

  return new Response(JSON.stringify({ modules: enriched }), { status: 200 });
}
