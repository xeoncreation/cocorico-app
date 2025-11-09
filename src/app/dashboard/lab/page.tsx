"use client";

import IngredientScanner from "@/components/IngredientScanner";
import SmartCamera from "@/components/SmartCamera";
import AvatarCocorico from "@/components/AvatarCocorico";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-amber-800">🧪 Laboratorio IA</h1>
      <p className="text-neutral-600">
        Prueba las funciones visuales de Cocorico: reconoce ingredientes desde una imagen o
        detecta en vivo con la cámara del dispositivo.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <IngredientScanner />
        </div>
        <div>
          <SmartCamera onLabels={setLabels} />
          {labels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <button
                onClick={searchWithLabels}
                className="px-3 py-2 border rounded text-sm hover:bg-amber-50"
              >
                🔎 Buscar con ingredientes
              </button>
              <button
                onClick={useInNewRecipe}
                className="px-3 py-2 border rounded text-sm hover:bg-amber-50"
              >
                ➕ Usar en Nueva receta
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Avatar overlay en esquina inferior derecha (modo AR) */}
      <AvatarCocorico small overlay />
    </main>
  );
}
