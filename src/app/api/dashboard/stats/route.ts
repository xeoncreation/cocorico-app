import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const [recipes, favorites, sessions, badges] = await Promise.all([
    supabase.from("recipes").select("id, created_at").eq("user_id", user.id),
    supabase.from("favorites").select("id").eq("user_id", user.id),
    supabase.from("cooking_sessions").select("id, duration_minutes").eq("user_id", user.id),
    supabase.from("user_badges").select("id, status").eq("user_id", user.id),
  ]);

  const totalRecipes = recipes.data?.length ?? 0;
  const totalFavorites = favorites.data?.length ?? 0;
  const totalMinutes = sessions.data?.reduce((acc: number, s: any) => acc + (s.duration_minutes ?? 0), 0) ?? 0;
  const unlockedBadges = badges.data?.filter((b: any) => b.status === "unlocked").length ?? 0;

  return new Response(JSON.stringify({ totalRecipes, totalFavorites, totalMinutes, unlockedBadges }), { status: 200 });
}
