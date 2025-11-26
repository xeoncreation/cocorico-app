import { Metadata } from "next";
import SearchClient from "./search-client";
import Wallpaper from "@/components/layout/Wallpaper";

export const metadata: Metadata = {
  title: "Buscar recetas | Cocorico",
  description:
    "Filtra recetas por ingredientes, tiempo, dificultad y estilo culinario.",
};

export default function RecipesSearchPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/SEARCH - BÚSQUEDA — Especias y hierbas, modo claro.png"
        imageDark="/branding/SEARCH - BÚSQUEDA — Especias en mesa, modo oscuro.png"
      />
      <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">Buscar recetas</h1>
          <p className="text-muted-foreground text-sm">
            Encuentra recetas por ingredientes, estilo, tiempo de cocina y más.
          </p>
        </header>

        {/* Client component with layout, filters and results */}
        <SearchClient />
      </main>
    </>
  );
}