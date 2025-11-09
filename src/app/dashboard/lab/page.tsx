"use client";

import IngredientScanner from "@/components/IngredientScanner";
import SmartCamera from "@/components/SmartCamera";
import AvatarCocorico from "@/components/AvatarCocorico";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function LabPage() {
  const router = useRouter();
  const [labels, setLabels] = useState<string[]>([]);

  function useInNewRecipe() {
    if (!labels.length) return;
    try {
      localStorage.setItem("cocorico_prefill_ingredients", JSON.stringify(labels));
    } catch {}
    router.push("/dashboard/new");
  }

  function searchWithLabels() {
    if (!labels.length) return;
    const params = new URLSearchParams({ ingredients: labels.join(",") });
    router.push(`/search?${params.toString()}`);
  }

  const chips = useMemo(
    () => (
      <div className="flex flex-wrap gap-2">
        {labels.map((l) => (
          <span
            key={l}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
          >
            🧩 {l}
          </span>
        ))}
      </div>
    ),
    [labels]
  );

  return (
    <main className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-orange-50/60 via-white to-yellow-50/40 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
      {/* Hero */}
      <section className="border-b border-neutral-200/70 dark:border-neutral-800/60">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-cocorico-brown dark:text-amber-300 tracking-tight">
                🧪 Laboratorio IA de Cocorico
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400 max-w-2xl">
                Explora funciones experimentales: detecta ingredientes con la cámara, analiza fotos y
                conviértelos en búsquedas o recetas en un clic. Todo en un entorno seguro.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Vision ON</span>
              <span className="px-2 py-1 rounded bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">Live Camera</span>
              <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Beta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section>
        <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-8">
          {/* Analyzer */}
          <div className="bg-white/80 dark:bg-neutral-900/70 backdrop-blur rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold">📸 Analizador de imágenes</h2>
              <p className="text-sm text-neutral-500 mt-1">Sube una foto y detectaremos los ingredientes presentes.</p>
            </div>
            <div className="p-5">
              <IngredientScanner />
            </div>
          </div>

          {/* Live camera */}
          <div className="bg-white/80 dark:bg-neutral-900/70 backdrop-blur rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-semibold">🎥 Cámara en vivo</h2>
              <p className="text-sm text-neutral-500 mt-1">Apunta a ingredientes reales y ve las etiquetas en tiempo real.</p>
            </div>
            <div className="p-5">
              <SmartCamera onLabels={setLabels} />
              {labels.length > 0 && (
                <div className="mt-4 space-y-3">
                  {chips}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={searchWithLabels}
                      className="px-3 py-2 rounded-lg bg-cocorico-yellow/30 hover:bg-cocorico-yellow/40 dark:bg-amber-900/30 dark:hover:bg-amber-900/40 text-sm"
                    >
                      🔎 Buscar recetas con estos ingredientes
                    </button>
                    <button
                      onClick={useInNewRecipe}
                      className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-sm"
                    >
                      ➕ Usar en una receta nueva
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="p-4 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800">
              💡 Consejo: Mejor luz = mejores detecciones.
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800">
              🔒 Privado: el vídeo no se guarda ni sale de tu dispositivo.
            </div>
            <div className="p-4 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800">
              🧪 Experimental: pueden aparecer etiquetas imprecisas.
            </div>
          </div>
        </div>
      </section>

      {/* Avatar overlay en esquina inferior derecha (modo AR) */}
      <AvatarCocorico small overlay />
    </main>
  );
}
