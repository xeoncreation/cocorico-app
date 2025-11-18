import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

  const { count: recipesCount } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("is_deleted", false);

  const { data: sessions } = await supabase
    .from("cooking_sessions")
    .select("minutes")
    .eq("user_id", user.id);

  const totalMinutes = (sessions ?? []).reduce((acc, s) => acc + (s.minutes ?? 0), 0);

  type BadgeRule = { code: string; condition: () => boolean };
  const rules: BadgeRule[] = [
    { code: "first_3_recipes", condition: () => (recipesCount ?? 0) >= 3 },
    { code: "2_hours_cooking", condition: () => totalMinutes >= 120 },
  ];

  const { data: allBadges } = await supabase.from("badges").select("id, code");
  const badgeByCode = new Map((allBadges ?? []).map((b: any) => [b.code, b]));

  const { data: already } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", user.id);

  const ownedIds = new Set((already ?? []).map((b: any) => b.badge_id));

  const toInsert = rules
    .filter((rule) => rule.condition())
    .map((rule) => badgeByCode.get(rule.code))
    .filter((b): b is { id: string } => Boolean(b))
    .filter((b) => !ownedIds.has(b.id))
    .map((b) => ({
      user_id: user.id,
      badge_id: b.id,
      status: "unlocked",
      earned_at: new Date().toISOString(),
    }));

  if (toInsert.length) {
    await supabase.from("user_badges").insert(toInsert);
  }

  return new Response(JSON.stringify({ unlocked: toInsert.length }), { status: 200 });
}
