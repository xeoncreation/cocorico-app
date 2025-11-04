import { supabaseServer } from "@/lib/supabase-client";
import { redirect } from "next/navigation";

export default async function AchievementsPage() {
  if (!supabaseServer) {
    redirect("/login");
  }

  const { data: { user } } = await supabaseServer.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const { data } = await supabaseServer
    .from("user_badges")
    .select("*")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-center">
      <h1 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">
        Tus logros 🥇
      </h1>
      {data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((b) => (
            <div
              key={b.id}
              className="p-4 bg-white dark:bg-neutral-900 rounded-lg shadow border border-neutral-200 dark:border-neutral-700 hover:scale-105 transition-transform"
            >
              {b.icon_url && (
                <img
                  src={b.icon_url}
                  alt={b.badge_name}
                  className="w-16 h-16 mx-auto mb-2"
                />
              )}
              <p className="font-semibold text-neutral-900 dark:text-white">
                {b.badge_name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {b.description}
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                {new Date(b.earned_at).toLocaleDateString("es-ES")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-neutral-50 dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <p className="text-neutral-500 dark:text-neutral-400">
            Aún no tienes logros, ¡empieza a cocinar! 🍳
          </p>
          <a
            href="/dashboard"
            className="inline-block mt-4 text-orange-600 dark:text-orange-400 hover:underline"
          >
            Volver al dashboard
          </a>
        </div>
      )}
    </div>
  );
}
