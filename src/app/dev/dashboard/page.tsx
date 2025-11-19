/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - profiles.plan column just added, Database type not regenerated yet
import Link from "next/link";
import { supabaseServer } from "@/app/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function DevDashboardPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user plan if authenticated
  let userPlan = "none";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    userPlan = profile?.plan || "free";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            🛠️ Developer Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Vista completa de desarrollo - Sin restricciones de plan
          </p>
          {user && (
            <div className="inline-block px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
              <span className="text-slate-400">Usuario:</span>{" "}
              <span className="text-cyan-400">{user.email}</span>
              {" · "}
              <span className="text-slate-400">Plan actual:</span>{" "}
              <span className={userPlan === "premium" ? "text-yellow-400" : "text-green-400"}>
                {userPlan}
              </span>
            </div>
          )}
        </header>

        {/* Quick Actions */}
        <section className="grid md:grid-cols-3 gap-4">
          <Link
            href="/api/dev/set-theme?theme=premium"
            className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl hover:scale-105 transition-transform"
          >
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Forzar Tema Premium</h3>
            <p className="text-sm text-slate-400">
              Activa el tema premium globalmente vía cookie
            </p>
          </Link>

          <Link
            href="/api/dev/set-theme?theme=free"
            className="p-6 bg-gradient-to-br from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-xl hover:scale-105 transition-transform"
          >
            <div className="text-3xl mb-3">🆓</div>
            <h3 className="text-xl font-semibold mb-2">Forzar Tema Free</h3>
            <p className="text-sm text-slate-400">
              Activa el tema gratuito globalmente
            </p>
          </Link>

          <Link
            href="/dev/premium-preview"
            className="p-6 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl hover:scale-105 transition-transform"
          >
            <div className="text-3xl mb-3">👁️</div>
            <h3 className="text-xl font-semibold mb-2">Preview Premium</h3>
            <p className="text-sm text-slate-400">Sin gateo de autenticación</p>
          </Link>
        </section>

        {/* Link Cards Simplified Section */}
        <section className="grid md:grid-cols-3 gap-6">
          <DevLinkCard href="/dev/ui-preview" title="UI Preview" description="Prueba Free/Premium, glass y ripple." icon="👁️" />
          <DevLinkCard href="/admin/users" title="Admin Usuarios" description="Consulta usuarios y planes." icon="👥" />
          <DevLinkCard href="/dashboard/stats" title="Stats" description="Gráficos y métricas de uso." icon="📊" />
          <DevLinkCard href="/dashboard/feedback" title="Feedback" description="Tickets y sugerencias." icon="🛠️" />
          <DevLinkCard href="/plans" title="Planes" description="Comparativa Free vs Premium." icon="✨" />
          <DevLinkCard href="/learn" title="Learn" description="Módulos de aprendizaje." icon="🎓" />
        </section>

        {/* Theme Pages */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-200">📄 Páginas Temáticas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Free Pages */}
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
              <h3 className="text-lg font-semibold text-green-400 mb-4">
                🆓 Versión Gratuita
              </h3>
              <Link
                href="/free"
                className="block px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition"
              >
                → /free - Landing Free
              </Link>
              <Link
                href="/"
                className="block px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition"
              >
                → / - Home (Redirige a /es)
              </Link>
              <Link
                href="/recipes"
                className="block px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition"
              >
                → /recipes - Recetas públicas
              </Link>
            </div>

            {/* Premium Pages */}
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
              <h3 className="text-lg font-semibold text-yellow-400 mb-4">
                ⭐ Versión Premium
              </h3>
              <Link
                href="/premium"
                className="block px-4 py-2 bg-yellow-600/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-600/30 transition"
              >
                → /premium - Landing Premium (Requiere plan)
              </Link>
              <Link
                href="/dev/premium-preview"
                className="block px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition"
              >
                → /dev/premium-preview - Vista sin gateo ✨
              </Link>
              <Link
                href="/upgrade"
                className="block px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition"
              >
                → /upgrade - Página de actualización
              </Link>
            </div>
          </div>
        </section>

        {/* Main Pages Status */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-200">
            📊 Estado de Páginas Principales
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { path: "/dashboard", label: "Dashboard", status: "✅" },
              { path: "/recipes", label: "Recetas", status: "✅" },
              { path: "/recipes/search", label: "Buscar Recetas", status: "⚠️" },
              { path: "/dashboard/favorites", label: "Favoritos", status: "✅" },
              { path: "/dashboard/lab", label: "Laboratorio IA", status: "✅" },
              { path: "/dashboard/import", label: "Importar", status: "✅" },
              { path: "/community", label: "Comunidad", status: "✅" },
              { path: "/admin", label: "Admin Panel", status: "✅" },
              { path: "/learn", label: "Aprender", status: "⚠️" },
              { path: "/dashboard/stats", label: "Estadísticas", status: "⚠️" },
              { path: "/settings", label: "Configuración", status: "✅" },
              { path: "/login", label: "Login", status: "✅" },
            ].map((page) => (
              <Link
                key={page.path}
                href={page.path}
                className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition flex items-center justify-between"
              >
                <span className="text-sm">{page.label}</span>
                <span className="text-lg">{page.status}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Dev Tools */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-200">🔧 Herramientas Dev</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/dev/audit"
              className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition"
            >
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-semibold">Audit Project</div>
              <div className="text-xs text-slate-400">Revisar configuración</div>
            </Link>

            <Link
              href="/dev-test"
              className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition"
            >
              <div className="text-2xl mb-2">🧪</div>
              <div className="font-semibold">Dev Test</div>
              <div className="text-xs text-slate-400">Pruebas rápidas</div>
            </Link>

            <a
              href="http://localhost:3000/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition"
            >
              <div className="text-2xl mb-2">💚</div>
              <div className="font-semibold">Health Check</div>
              <div className="text-xs text-slate-400">Estado del servidor</div>
            </a>
          </div>
        </section>

        {/* Documentation */}
        <section className="p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
          <h2 className="text-xl font-bold text-slate-200 mb-4">📚 Documentación</h2>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              • <strong className="text-white">BETA-CHECKLIST.md</strong> - Lista
              de verificación de features
            </li>
            <li>
              • <strong className="text-white">ASSETS-SETUP.md</strong> - Configuración
              de assets en Supabase
            </li>
            <li>
              • <strong className="text-white">INSTRUCCIONES-DEV-TOOLS.md</strong> -
              Cómo usar herramientas dev
            </li>
            <li>
              • <strong className="text-white">SOLUCION-PREMIUM-GLASS.md</strong> -
              Efecto glass y acceso premium
            </li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm pt-8">
          <p>🔒 Esta página solo es visible en desarrollo</p>
          <p className="mt-2">
            Contraseña del sitio:{" "}
            {process.env.SITE_PASSWORD ? (
              <code className="text-cyan-400 bg-slate-800 px-2 py-1 rounded">
                {process.env.SITE_PASSWORD}
              </code>
            ) : (
              <span className="text-green-400">Desactivada</span>
            )}
          </p>
        </footer>
      </div>
    </main>
  );
}

function DevLinkCard({href,title,description,icon}:{href:string;title:string;description:string;icon:string}){
  return (
    <a href={href} className="p-4 rounded-xl border border-slate-700 bg-slate-800/40 hover:bg-slate-700/40 transition flex flex-col gap-2">
      <div className="text-2xl">{icon}</div>
      <div className="text-sm font-semibold">{title}</div>
      <p className="text-xs text-slate-400">{description}</p>
    </a>
  );
}
