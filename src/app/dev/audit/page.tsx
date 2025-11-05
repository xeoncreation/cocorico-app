import { supabaseServer } from "@/lib/supabase-client";
import { redirect } from "next/navigation";

const DEV_EMAIL = process.env.DEV_EMAIL || "carlos@xeoncreative.com";

export default async function DevAuditPage() {
  if (!supabaseServer) {
    redirect("/login");
  }

  const { data: { user } } = await supabaseServer.auth.getUser();
  
  if (!user || user.email !== DEV_EMAIL) {
    redirect("/");
  }

  // Fetch statistics
  const { count: usersCount } = await supabaseServer
    .from("user_profiles")
    .select("*", { count: "exact", head: true });

  const { count: recipesCount } = await supabaseServer
    .from("recipes")
    .select("*", { count: "exact", head: true });

  const { count: postsCount } = await supabaseServer
    .from("posts")
    .select("*", { count: "exact", head: true });

  const { data: avgXP } = await supabaseServer
    .from("user_progress")
    .select("xp");
  
  const averageXP = avgXP?.length 
    ? Math.round(avgXP.reduce((sum, u) => sum + (u.xp || 0), 0) / avgXP.length)
    : 0;

  const { count: invitesCount } = await supabaseServer
    .from("beta_invites")
    .select("*", { count: "exact", head: true });

  const { count: badgesCount } = await supabaseServer
    .from("user_badges")
    .select("*", { count: "exact", head: true });

  const { count: challengesCount } = await supabaseServer
    .from("daily_challenges")
    .select("*", { count: "exact", head: true });

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          📊 Auditoría del Sistema
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Vista general de estadísticas y estado de módulos
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Usuarios" value={usersCount || 0} icon="👥" />
        <StatCard title="Recetas" value={recipesCount || 0} icon="📖" />
        <StatCard title="Posts" value={postsCount || 0} icon="📸" />
        <StatCard title="XP Promedio" value={averageXP} icon="⭐" />
        <StatCard title="Invitaciones" value={invitesCount || 0} icon="✉️" />
        <StatCard title="Logros Ganados" value={badgesCount || 0} icon="🏅" />
        <StatCard title="Retos Activos" value={challengesCount || 0} icon="🎯" />
        <StatCard title="Estado" value="Online" icon="✅" valueColor="text-green-600" />
      </div>

      {/* Modules Status */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
          Estado de Módulos
        </h2>
        <div className="space-y-3">
          <ModuleRow name="Block 51: Beta Invites" status="active" />
          <ModuleRow name="Block 52: Stripe Subscriptions" status="active" />
          <ModuleRow name="Block 53: Gamification (XP, Levels, Badges)" status="active" />
          <ModuleRow name="Block 54: Community Social" status="active" />
          <ModuleRow name="Block 54B: Advanced Security" status="active" />
          <ModuleRow name="Middleware: Password Gate + Invites" status="active" />
          <ModuleRow name="Language Selector (10 idiomas)" status="active" />
          <ModuleRow name="Dev Lab (/dev/lab)" status="active" />
        </div>
      </div>

      {/* Migrations */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
          Migraciones SQL
        </h2>
        <div className="space-y-2 text-sm font-mono">
          <MigrationRow name="20251104_beta_invites.sql" />
          <MigrationRow name="20251104_gamification.sql" />
          <MigrationRow name="20251105_community_social.sql" />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <a
          href="/dev/lab"
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Ir al Lab
        </a>
        <a
          href="/dashboard"
          className="border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold px-6 py-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
        >
          Dashboard
        </a>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, valueColor = "text-neutral-900 dark:text-white" }: { 
  title: string; 
  value: number | string; 
  icon: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-3xl font-bold ${valueColor}`}>{value}</span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{title}</p>
    </div>
  );
}

function ModuleRow({ name, status }: { name: string; status: "active" | "inactive" }) {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
      <span className="text-neutral-700 dark:text-neutral-300">{name}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        status === "active" 
          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
          : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400"
      }`}>
        {status === "active" ? "✅ Activo" : "⚠️ Inactivo"}
      </span>
    </div>
  );
}

function MigrationRow({ name }: { name: string }) {
  return (
    <div className="p-2 bg-neutral-50 dark:bg-neutral-800 rounded text-neutral-700 dark:text-neutral-300">
      ✓ {name}
    </div>
  );
}
