import PlanThemeProvider from "@/components/PlanThemeProvider";
import VisualHero from "@/components/VisualHero";
import { getAssetsMap } from "@/lib/getAssetsMap";
import { requirePremiumOrRedirect } from "@/lib/getUserPlan";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  // 🚧 Gateo aquí: si no es premium, redirige a /upgrade
  await requirePremiumOrRedirect();

  const theme = "premium" as const;
  const assets = await getAssetsMap(theme);
  const hero = assets.get("home");

  return (
    <PlanThemeProvider theme={theme}>
      <main className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800 text-white">
        {/* fondo decorativo para hacer notable el blur */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 bg-premium-radials"
        />
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#2EC4B6] to-[#FFD166] bg-clip-text text-transparent">
            Cocorico — Premium
          </h1>
          <Link 
            href="/free" 
            className="underline text-[#FFD166] hover:text-[#2EC4B6] transition"
          >
            Volver a Free
          </Link>
        </header>

        <VisualHero url={hero} />

        {/* Bloques premium con estética glass */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="glass-card-premium p-5 rounded-2xl">
            <h3 className="font-semibold mb-2">Modo Cocina inmersivo</h3>
            <p className="text-sm opacity-80">Pasos guiados con video de fondo y control por gestos.</p>
          </div>
          <div className="glass-card-premium p-5 rounded-2xl">
            <h3 className="font-semibold mb-2">Sugerencias IA avanzadas</h3>
            <p className="text-sm opacity-80">Optimiza macros, coste y tiempo por ración.</p>
          </div>
          <div className="glass-card-premium p-5 rounded-2xl">
            <h3 className="font-semibold mb-2">Visuals dinámicos</h3>
            <p className="text-sm opacity-80">Hologramas y partículas sutiles en la interfaz.</p>
          </div>
        </section>

        <section className="mt-12 text-center space-y-4">
          <h2 className="text-xl font-bold">Disfruta tu experiencia premium</h2>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#2EC4B6] to-[#FFD166] text-slate-900 font-semibold hover:opacity-90 transition shadow-lg"
          >
            Ir al Dashboard
          </Link>
        </section>
        </div>
      </main>
    </PlanThemeProvider>
  );
}
