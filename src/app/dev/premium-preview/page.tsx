import PlanThemeProvider from "@/components/PlanThemeProvider";
import VisualHero from "@/components/VisualHero";
import { getAssetsMap } from "@/lib/getAssetsMap";

// Esta página ignora auth/plan. Úsala para QA visual.
export const dynamic = "force-dynamic";

export default async function PremiumPreviewPage() {
  const theme: "premium" = "premium";
  const assets = await getAssetsMap(theme);
  const hero = assets.get("home"); // asegúrate de tener asset_premium para 'home'

  return (
    <PlanThemeProvider theme={theme}>
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Preview — Premium (Glass)</h1>
          <div className="flex gap-3">
            <a className="underline" href="/api/dev/set-theme?theme=premium">Forzar Premium</a>
            <a className="underline" href="/api/dev/set-theme?theme=free">Forzar Free</a>
          </div>
        </header>

        <VisualHero url={hero} />

        <section className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface/70 border border-white/10 shadow-sm backdrop-blur-xl">
            <h3 className="font-semibold mb-2">Modo Cocina inmersivo</h3>
            <p className="text-sm opacity-80">Pasos guiados con video de fondo y controles grandes.</p>
          </div>
          <div className="p-5 rounded-2xl bg-surface/70 border border-white/10 shadow-sm backdrop-blur-xl">
            <h3 className="font-semibold mb-2">IA avanzada</h3>
            <p className="text-sm opacity-80">Macros, coste por ración, sustituciones inteligentes.</p>
          </div>
          <div className="p-5 rounded-2xl bg-surface/70 border border-white/10 shadow-sm backdrop-blur-xl">
            <h3 className="font-semibold mb-2">Interfaz Glass</h3>
            <p className="text-sm opacity-80">Blur dinámico, acentos luminosos, motion suave.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Efecto Liquid Glass</h2>
          <div className="relative rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-lg p-8">
            <p className="text-base">Este bloque usa glassmorphism con backdrop-blur y bordes translúcidos.</p>
            {/* eslint-disable-next-line @next/next/no-css-tags */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                maskImage: 'radial-gradient(180px 80px at 20% 10%, black, transparent)',
                WebkitMaskImage: 'radial-gradient(180px 80px at 20% 10%, black, transparent)'
              }}
            />
          </div>
        </section>
      </main>
    </PlanThemeProvider>
  );
}
