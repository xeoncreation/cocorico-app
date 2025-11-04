import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function StatsPage() {
  const hasEnv = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  let publicRecipes = 0;
  let privateRecipes = 0;
  let users = 0;

  if (hasEnv) {
    try {
      const supabase = createServerComponentClient({ cookies });

      const pub = await supabase
        .from("recipes")
        .select("*", { count: "exact", head: true })
        .eq("visibility", "public");
      publicRecipes = pub.count ?? 0;

      const priv = await supabase
        .from("recipes")
        .select("*", { count: "exact", head: true })
        .eq("visibility", "private");
      privateRecipes = priv.count ?? 0;

      const u = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      users = u.count ?? 0;
    } catch (e) {
      // Silently fallback to zeros in dev if DB not reachable
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Stats] Supabase no disponible, mostrando valores por defecto.");
      }
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-amber-800">📊 Estadísticas</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h3 className="text-3xl font-bold text-amber-700">{users}</h3>
          <p className="text-sm text-neutral-600">Usuarios registrados</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h3 className="text-3xl font-bold text-green-700">
            {publicRecipes}
          </h3>
          <p className="text-sm text-neutral-600">Recetas públicas</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4 text-center">
          <h3 className="text-3xl font-bold text-neutral-700">
            {privateRecipes}
          </h3>
          <p className="text-sm text-neutral-600">Recetas privadas</p>
        </div>
      </div>
      <p className="text-center text-sm text-neutral-500">
        {hasEnv ? (
          <>Datos actualizados automáticamente desde Supabase 🔄</>
        ) : (
          <>Conecta Supabase para ver métricas reales 🔒</>
        )}
      </p>
    </main>
  );
}
