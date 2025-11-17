import PlanThemeProvider from "@/components/PlanThemeProvider";
import VisualHero from "@/components/VisualHero";
import { getAssetsMap } from "@/lib/getAssetsMap";

// Esta página ignora auth/plan. Úsala para QA visual.
export const dynamic = "force-dynamic";

export default async function PremiumPreviewPage() {
  const theme = "premium" as const;
  const assets = await getAssetsMap(theme);
  const hero = assets.get("home"); // asegúrate de tener asset_premium para 'home'

  return (
    <PlanThemeProvider theme={theme}>
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#2EC4B6] to-[#FFD166] bg-clip-text text-transparent">Preview — Premium (Glass)</h1>
          <div className="flex gap-3">
            <a className="underline text-[#2EC4B6] hover:text-[#FFD166] transition" href="/api/dev/set-theme?theme=premium">Forzar Premium</a>
            <a className="underline text-[#FFD166] hover:text-[#2EC4B6] transition" href="/api/dev/set-theme?theme=free">Forzar Free</a>
          </div>
        </header>

        <VisualHero url={hero} />

        <section className="grid md:grid-cols-3 gap-4">
          <div className="glass-card-premium p-5 rounded-2xl">
            <h3 className="font-semibold mb-2">Modo Cocina inmersivo</h3>
            <p className="text-sm opacity-80">Pasos guiados con video de fondo y controles grandes.</p>
          </div>
          <div className="glass-card-premium p-5 rounded-2xl">
            <h3 className="font-semibold mb-2">IA avanzada</h3>
            <p className="text-sm opacity-80">Macros, coste por ración, sustituciones inteligentes.</p>
          </div>
          <div className="glass-card-premium p-5 rounded-2xl">
            <h3 className="font-semibold mb-2">Interfaz Glass</h3>
            <p className="text-sm opacity-80">Blur dinámico, acentos luminosos, motion suave.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Efecto Liquid Glass</h2>
          <div className="glass-card-premium relative rounded-2xl p-8">
            {/* patrón de fondo sutil para que el blur sea evidente */}
            <div className="absolute -inset-6 -z-10 opacity-80 blur-0 bg-premium-radials" aria-hidden />
            <p className="text-base mb-4">Este bloque usa glassmorphism con backdrop-blur y bordes translúcidos.</p>
            <p className="text-sm opacity-70">Observa el efecto de desenfoque del fondo, los bordes brillantes y la sombra profunda.</p>
            <div className="absolute inset-0 pointer-events-none mask-liquid-glass rounded-2xl" />
          </div>
        </section>
        </div>
      </main>
    </PlanThemeProvider>
  );
}
