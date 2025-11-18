import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const [{ count: recipesCount }, { count: favoritesCount }, sessions, { count: badgesCount }] = await Promise.all([
    supabase.from("recipes").select("*", { count: "exact", head: true }).eq("owner_id", user.id).eq("is_deleted", false),
    supabase.from("favorites").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("cooking_sessions").select("minutes").eq("user_id", user.id),
    supabase.from("user_badges").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ] as any);

  const totalMinutes = (sessions.data ?? []).reduce((acc: number, s: any) => acc + (s.minutes ?? 0), 0);

  return new Response(
    JSON.stringify({
      totalRecipes: recipesCount ?? 0,
      totalFavorites: favoritesCount ?? 0,
      totalMinutes,
      unlockedBadges: badgesCount ?? 0,
    }),
    { status: 200 }
  );
}
