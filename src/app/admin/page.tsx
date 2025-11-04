import { supabaseServer } from "@/lib/supabase-client";
import { isAdmin } from "@/utils/authRole";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Verificar autenticación y permisos
  if (!supabaseServer) redirect("/");
  
  const { data: { user } } = await supabaseServer.auth.getUser();
  if (!user) redirect("/login");

  const ok = await isAdmin(user.id);
  if (!ok) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold text-red-500 mb-4">⛔ Acceso denegado</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          No tienes permisos de administrador
        </p>
        <Link href="/dashboard" className="text-cocorico-red underline">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  // Cargar métricas generales
  const [recipesData, messagesData] = await Promise.all([
    (supabaseServer as any).from("recipes").select("*", { count: "exact", head: true }),
    (supabaseServer as any).from("messages").select("*", { count: "exact", head: true }),
  ]);

  const recipesCount = recipesData.count || 0;
  const messagesCount = messagesData.count || 0;

  // Obtener conteo de usuarios de user_profiles (más fiable que auth.users directamente)
  const { count: usersCount } = await (supabaseServer as any)
    .from("user_profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Panel de administración 🧑‍🍳</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Vista general del sistema y gestión de usuarios
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <MetricCard
          title="Usuarios"
          value={usersCount || 0}
          color="text-cocorico-red"
          icon="👥"
        />
        <MetricCard
          title="Recetas"
          value={recipesCount}
          color="text-cocorico-yellow"
          icon="📖"
        />
        <MetricCard
          title="Mensajes IA"
          value={messagesCount}
          color="text-green-500"
          icon="💬"
        />
      </div>

      {/* Tabla de usuarios recientes */}
      <section className="bg-white dark:bg-neutral-900 rounded-xl shadow border dark:border-neutral-800 p-6">
        <h2 className="text-2xl mb-4 font-semibold">Últimos usuarios registrados</h2>
        <UsersTable />
      </section>

      {/* Sección de recetas recientes */}
      <section className="mt-8 bg-white dark:bg-neutral-900 rounded-xl shadow border dark:border-neutral-800 p-6">
        <h2 className="text-2xl mb-4 font-semibold">Últimas recetas publicadas</h2>
        <RecipesTable />
      </section>
    </div>
  );
}

function MetricCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow p-6 border dark:border-neutral-800">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">{title}</h2>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className={`text-4xl font-bold ${color}`}>{value.toLocaleString()}</p>
    </div>
  );
}

async function UsersTable() {
  if (!supabaseServer) return <p>No hay conexión a la base de datos</p>;

  const { data } = await (supabaseServer as any)
    .from("user_profiles")
    .select("user_id, username, created_at, level, experience")
    .order("created_at", { ascending: false })
    .limit(10);

  if (!data || data.length === 0) {
    return <p className="text-neutral-500">No hay usuarios registrados</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border dark:border-neutral-700 text-sm">
        <thead className="bg-neutral-100 dark:bg-neutral-800">
          <tr>
            <th className="p-3 text-left">Usuario</th>
            <th className="p-3 text-left">Nivel</th>
            <th className="p-3 text-left">Experiencia</th>
            <th className="p-3 text-left">Fecha alta</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u: any) => (
            <tr key={u.user_id} className="border-b dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
              <td className="p-3">
                <Link href={`/u/${u.username}`} className="text-cocorico-red hover:underline">
                  @{u.username || "usuario"}
                </Link>
              </td>
              <td className="p-3">{u.level}</td>
              <td className="p-3">{u.experience} XP</td>
              <td className="p-3">{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function RecipesTable() {
  if (!supabaseServer) return <p>No hay conexión a la base de datos</p>;

  const { data } = await (supabaseServer as any)
    .from("recipes")
    .select("id, title, visibility, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(10);

  if (!data || data.length === 0) {
    return <p className="text-neutral-500">No hay recetas publicadas</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border dark:border-neutral-700 text-sm">
        <thead className="bg-neutral-100 dark:bg-neutral-800">
          <tr>
            <th className="p-3 text-left">Título</th>
            <th className="p-3 text-left">Visibilidad</th>
            <th className="p-3 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r: any) => (
            <tr key={r.id} className="border-b dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
              <td className="p-3">
                <Link href={`/recipes/${r.id}`} className="text-cocorico-red hover:underline">
                  {r.title}
                </Link>
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  r.visibility === 'public' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                  'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                }`}>
                  {r.visibility}
                </span>
              </td>
              <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
