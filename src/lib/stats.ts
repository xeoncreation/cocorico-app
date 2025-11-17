// Script to load user stats from Supabase for real data visualization
// Usage: Call this from stats-client.tsx to replace dummy data

import { createClient } from "@supabase/supabase-js";

export type UserStats = {
  recipesCreated: number;
  recipesCooked: number;
  totalTimeMinutes: number;
  favoriteCategories: { category: string; count: number }[];
  monthlyActivity: { month: string; count: number }[];
  communityRank: number;
  communityPercentile: number;
  level: number;
  xp: number;
  badges: number;
};

export async function loadUserStats(userId: string): Promise<UserStats | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // Get user's recipes created
    const { count: recipesCreated } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Get user's cooking history (if you have a cooking_history table)
    const { data: cookingHistory } = await supabase
      .from("cooking_history")
      .select("recipe_id, cooked_at, time_minutes")
      .eq("user_id", userId)
      .order("cooked_at", { ascending: false })
      .limit(100);

    // Get user profile for level/xp
    const { data: profile } = await supabase
      .from("profiles")
      .select("level, xp")
      .eq("id", userId)
      .single();

    // Calculate monthly activity (last 6 months)
    const monthlyActivity = calculateMonthlyActivity(cookingHistory || []);

    // Calculate favorite categories
    const favoriteCategories = await calculateFavoriteCategories(userId, supabase);

    // Calculate total time
    const totalTimeMinutes = (cookingHistory || []).reduce(
      (sum, h) => sum + (h.time_minutes || 0),
      0
    );

    // Get community rank (simplified)
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: usersAbove } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gt("xp", profile?.xp || 0);

    const communityRank = (usersAbove || 0) + 1;
    const communityPercentile = totalUsers
      ? Math.round(((totalUsers - communityRank) / totalUsers) * 100)
      : 50;

    return {
      recipesCreated: recipesCreated || 0,
      recipesCooked: cookingHistory?.length || 0,
      totalTimeMinutes,
      favoriteCategories,
      monthlyActivity,
      communityRank,
      communityPercentile,
      level: profile?.level || 1,
      xp: profile?.xp || 0,
      badges: 0, // TODO: Count from badges table
    };
  } catch (error) {
    console.error("Error loading user stats:", error);
    return null;
  }
}

function calculateMonthlyActivity(
  history: { cooked_at: string }[]
): { month: string; count: number }[] {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const now = new Date();
  const result: { month: string; count: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = months[date.getMonth()];
    const count = history.filter((h) => {
      const cookedDate = new Date(h.cooked_at);
      return (
        cookedDate.getMonth() === date.getMonth() &&
        cookedDate.getFullYear() === date.getFullYear()
      );
    }).length;

    result.push({ month: monthName, count });
  }

  return result;
}

async function calculateFavoriteCategories(
  userId: string,
  supabase: any
): Promise<{ category: string; count: number }[]> {
  // This assumes you have a way to track favorite recipes or cooking history
  // For now, return dummy data structure
  const { data: favorites } = await supabase
    .from("recipe_favorites")
    .select("recipe:recipes(category)")
    .eq("user_id", userId);

  const categoryCount: Record<string, number> = {};

  favorites?.forEach((fav: any) => {
    const cat = fav.recipe?.category || "Otros";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  return Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}

export async function exportStatsToCSV(stats: UserStats): Promise<string> {
  const csv = [
    "Metric,Value",
    `Recipes Created,${stats.recipesCreated}`,
    `Recipes Cooked,${stats.recipesCooked}`,
    `Total Time (hours),${Math.round(stats.totalTimeMinutes / 60)}`,
    `Level,${stats.level}`,
    `XP,${stats.xp}`,
    `Community Rank,${stats.communityRank}`,
    `Community Percentile,${stats.communityPercentile}%`,
  ].join("\n");

  return csv;
}
