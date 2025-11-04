import { supabaseServer } from "@/lib/supabase-client";

export default async function UserProgressCard({ userId }: { userId: string }) {
  if (!supabaseServer) return null;

  const { data } = await supabaseServer
    .from("user_progress")
    .select("xp, level, streak")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return null;

  const percent = (data.xp % 500) / 5; // cada nivel son 500 XP

  return (
    <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow text-center">
      <h2 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-white">
        Tu progreso 🏆
      </h2>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
        Nivel {data.level} • {data.xp} XP • 🔥 Racha {data.streak} días
      </p>
      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
          data-percent={percent}
        />
      </div>
      <style jsx>{`
        div[data-percent] {
          width: ${percent}%;
        }
      `}</style>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
        {500 - (data.xp % 500)} XP para el siguiente nivel
      </p>
    </div>
  );
}
