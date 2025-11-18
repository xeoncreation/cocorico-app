"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Trophy, TrendingUp } from "lucide-react";

interface Profile {
  xp: number;
  level: number;
}

export default function XpHud() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("xp, level")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({ xp: data.xp || 0, level: data.level || 1 });
      }
      setLoading(false);
    }

    loadProfile();
  }, [supabase]);

  if (loading || !profile) return null;

  const xpForNextLevel = profile.level * 100;
  const xpProgress = profile.xp % 100;
  const progressPercentage = (xpProgress / 100) * 100;

  return (
    <div className="coco-glass-card p-4 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-lg glass-text-strong">
            Nivel {profile.level}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>{profile.xp} XP</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{xpProgress} / 100 XP</span>
          <span>Siguiente nivel: {profile.level + 1}</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
