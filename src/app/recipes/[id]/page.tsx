
import Wallpaper from "@/components/layout/Wallpaper";

export default function RecipePage() {
  // TODO: Integrar lógica real de receta pública
  return (
    <>
      <Wallpaper
        imageLight="/branding/RECETA PÚBLICA — Plating gourmet, modo claro.png"
        imageDark="/branding/RECETA PÚBLICA — Plating gourmet, modo oscuro.png"
      />
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <button className="text-blue-500 hover:text-blue-600">
            ← Volver
          </button>
        </div>
        <article className="space-y-6">
          <header>
            <h1 className="text-3xl font-bold mb-2">Título de la receta</h1>
            <p className="text-gray-600">Descripción de la receta.</p>
          </header>
          {/* Aquí irían los ingredientes, instrucciones, notas, etc. */}
        </article>
      </div>
    </>
  );
}