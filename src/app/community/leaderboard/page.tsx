import { supabaseServer } from "@/lib/supabase-client";

export default async function LeaderboardPage() {
  if (!supabaseServer) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-6 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">
          No se pudo cargar el ranking
        </p>
      </div>
    );
  }

  const { data } = await supabaseServer
    .from("user_progress")
    .select("user_id, xp, level")
    .order("xp", { ascending: false })
    .limit(10);

  const { data: profiles } = await supabaseServer
    .from("user_profiles")
    .select("user_id, username, avatar_url");

  const merged = data?.map((u) => ({
    ...u,
    username: profiles?.find((p) => p.user_id === u.user_id)?.username || "Anónimo",
    avatar_url: profiles?.find((p) => p.user_id === u.user_id)?.avatar_url,
  }));

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-center">
      <h1 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">
        Top Cocineros del Mes 🐓
      </h1>
      
      {!merged || merged.length === 0 ? (
        <div className="bg-neutral-50 dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <p className="text-neutral-500 dark:text-neutral-400">
            Aún no hay usuarios en el ranking. ¡Sé el primero!
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {merged.map((u, i) => (
            <li
              key={u.user_id}
              className="flex items-center gap-3 justify-between bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold w-8 text-neutral-700 dark:text-neutral-300">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                </span>
                <img
                  src={u.avatar_url || "/default-avatar.png"}
                  alt={u.username}
                  className="w-10 h-10 rounded-full border-2 border-neutral-200 dark:border-neutral-700"
                />
                <div className="text-left">
                  <p className="font-medium text-neutral-900 dark:text-white">
                    @{u.username}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Nivel {u.level}
                  </p>
                </div>
              </div>
              <p className="text-orange-600 dark:text-orange-400 font-semibold">
                {u.xp} XP
              </p>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-8">
        <a
          href="/dashboard"
          className="inline-block text-orange-600 dark:text-orange-400 hover:underline"
        >
          Volver al dashboard
        </a>
      </div>
    </div>
  );
}
