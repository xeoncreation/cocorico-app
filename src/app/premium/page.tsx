import ThemeProvider from "@/components/ThemeProvider";
import VisualHero from "@/components/VisualHero";
import { getAssetsMap } from "@/lib/getAssetsMap";
import { requirePremiumOrRedirect } from "@/lib/getUserPlan";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  // 🚧 Gateo aquí: si no es premium, redirige a /upgrade
  await requirePremiumOrRedirect();

  const theme: "premium" = "premium";
  const assets = await getAssetsMap(theme);
  const hero = assets.get("home");

  return (
    <ThemeProvider theme={theme}>
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
            Cocorico — Premium
          </h1>
          <Link 
            href="/free" 
            className="underline hover:opacity-80 transition text-[var(--color-text)]"
          >
            Volver a Free
          </Link>
        </header>

        <VisualHero url={hero} />

        {/* Bloques premium con estética glass */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-white/10 shadow-sm backdrop-blur-xl">
            <h3 className="font-semibold mb-2 text-[var(--color-text)]">Modo Cocina inmersivo</h3>
            <p className="text-sm opacity-80">Pasos guiados con video de fondo y control por gestos.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-white/10 shadow-sm backdrop-blur-xl">
            <h3 className="font-semibold mb-2 text-[var(--color-text)]">Sugerencias IA avanzadas</h3>
            <p className="text-sm opacity-80">Optimiza macros, coste y tiempo por ración.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-white/10 shadow-sm backdrop-blur-xl">
            <h3 className="font-semibold mb-2 text-[var(--color-text)]">Visuals dinámicos</h3>
            <p className="text-sm opacity-80">Hologramas y partículas sutiles en la interfaz.</p>
          </div>
        </section>

        <section className="mt-12 text-center space-y-4">
          <h2 className="text-xl font-bold text-[var(--color-text)]">Disfruta tu experiencia premium</h2>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition"
          >
            Ir al Dashboard
          </Link>
        </section>
      </main>
    </ThemeProvider>
  );
}
