import ThemeProvider from "@/components/ThemeProvider";
import VisualHero from "@/components/VisualHero";
import { getAssetsMap } from "@/lib/getAssetsMap";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FreePage() {
  const theme: "free" = "free";
  const assets = await getAssetsMap(theme);
  const hero = assets.get("home");

  return (
    <ThemeProvider theme={theme}>
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
            Cocorico — Versión Gratuita
          </h1>
          <Link 
            href="/premium" 
            className="text-[var(--color-primary)] underline hover:opacity-80 transition"
          >
            Probar Premium
          </Link>
        </header>

        <VisualHero url={hero} />

        <section className="grid md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--color-surface)] shadow-sm">
            <h3 className="font-semibold mb-2 text-[var(--color-text)]">Explorar recetas</h3>
            <p className="text-sm opacity-80">Busca por ingredientes, tiempo y dificultad.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--color-surface)] shadow-sm">
            <h3 className="font-semibold mb-2 text-[var(--color-text)]">Guardar favoritas</h3>
            <p className="text-sm opacity-80">Crea tu recetario personal en la nube.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--color-surface)] shadow-sm">
            <h3 className="font-semibold mb-2 text-[var(--color-text)]">Sugerencias IA</h3>
            <p className="text-sm opacity-80">Sustituciones y versión rápida en 1 clic.</p>
          </div>
        </section>

        <section className="mt-12 text-center space-y-4">
          <h2 className="text-xl font-bold text-[var(--color-text)]">¿Listo para empezar?</h2>
          <Link
            href="/recipes"
            className="inline-block px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition"
          >
            Ver Recetas
          </Link>
        </section>
      </main>
    </ThemeProvider>
  );
}
