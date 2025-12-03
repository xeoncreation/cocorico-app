import BadgesClient from "./badges-client";
import { Metadata } from "next";
import Wallpaper from "@/components/layout/Wallpaper";

export const metadata: Metadata = {
  title: "Logros | Cocorico",
  description: "Desbloquea insignias cocinando, creando y aprendiendo.",
};

export default function BadgesPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS RECETAS- DASHBOARD — Cocina cenital difusa, modo claro.png"
        imageDark="/branding/MIS RECETAS - DASHBOARD — Encimera oscura gourmet, modo oscuro.png"
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
      <BadgesClient />
    </main>
    </>
  );
}
