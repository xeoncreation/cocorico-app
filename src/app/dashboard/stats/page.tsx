

import { AppBackground } from "@/components/layout/AppBackground";
import Wallpaper from "@/components/layout/Wallpaper";

export default function StatsPage() {
  // TODO: Integrar lógica real de estadísticas
  const users = 0;
  const publicRecipes = 0;
  const privateRecipes = 0;
  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS RECETAS- DASHBOARD — Cocina cenital difusa, modo claro.png"
        imageDark="/branding/MIS RECETAS - DASHBOARD — Encimera oscura gourmet, modo oscuro.png"
      />
      <AppBackground variantOverride="stats">
        <main className="max-w-3xl mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold glass-text-strong coco-heading">📊 Estadísticas</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <h3 className="text-3xl font-bold text-amber-700">{users}</h3>
              <p className="text-sm text-neutral-600">Usuarios registrados</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <h3 className="text-3xl font-bold text-green-700">{publicRecipes}</h3>
              <p className="text-sm text-neutral-600">Recetas públicas</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <h3 className="text-3xl font-bold text-neutral-700">{privateRecipes}</h3>
              <p className="text-sm text-neutral-600">Recetas privadas</p>
            </div>
          </div>
        </main>
      </AppBackground>
    </>
  );
}
