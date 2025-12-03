import PlansClient from "./plans-client";
import { Metadata } from "next";
import Wallpaper from "@/components/layout/Wallpaper";

export const metadata: Metadata = {
  title: "Planes | Cocorico",
  description: "Comparativa entre Free y Premium. Actualiza para desbloquear todo el potencial.",
};

export default function PlansPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/HOME-INICIO,  Fondo Campo de Trigo, modo claro.png"
        imageDark="/branding/HOME - INICIO — Campo de trigo nocturno cálido (dark mode).png"
      />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <PlansClient />
      </main>
    </>
  );
}

