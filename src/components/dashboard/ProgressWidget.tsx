"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import { Flame, Trophy, Star, TrendingUp } from "lucide-react";

interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  totalRecipes: number;
  weekActivity: number;
}

export default function ProgressWidget() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("level, xp, streak")
          .eq("id", user.id)
          .single();

        // Get recipe count
        const { count: recipeCount } = await supabase
          .from("recipes")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        // Calculate week activity (interactions in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: weekCount } = await supabase
          .from("user_interactions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", sevenDaysAgo.toISOString());

        const level = profile?.level || 1;
        const xp = profile?.xp || 0;
        const xpToNextLevel = level * 100; // Simple formula

        setStats({
          level,
          xp,
          xpToNextLevel,
          streak: profile?.streak || 0,
          totalRecipes: recipeCount || 0,
          weekActivity: weekCount || 0,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [supabase]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} className="h-24 animate-pulse bg-neutral-200/50 dark:bg-neutral-800/50" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Level Widget */}
      <GlassCard className="p-4 hover:scale-[1.02] transition-transform">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cocorico-mango to-cocorico-datil flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {stats.level}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">Nivel</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cocorico-mango to-cocorico-datil transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
              {stats.xp}/{stats.xpToNextLevel} XP
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Streak Widget */}
      <GlassCard className="p-4 hover:scale-[1.02] transition-transform">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cocorico-red to-cocorico-mango flex items-center justify-center shadow-lg">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-cocorico-red dark:text-amber-400">
              {stats.streak}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
              Días de racha
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Recipes Widget */}
      <GlassCard className="p-4 hover:scale-[1.02] transition-transform">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cocorico-avocado to-cocorico-turquoise flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-cocorico-avocado dark:text-green-400">
              {stats.totalRecipes}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
              Recetas creadas
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Week Activity Widget */}
      <GlassCard className="p-4 hover:scale-[1.02] transition-transform">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cocorico-turquoise to-cocorico-avocado flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-cocorico-turquoise dark:text-teal-400">
              {stats.weekActivity}
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">
              Actividad semanal
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
