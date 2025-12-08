import { Metadata } from "next";
import ScannerUnifiedClient from "./scanner-unified-client";
import { LiquidGlassContainer } from "@/components/ui/LiquidGlass";

export const metadata: Metadata = {
  title: "Food Scanner | Cocorico",
  description: "Escanea códigos de barras o fotografías de alimentos para obtener información nutricional instantánea y puntuación Cocorico.",
};

export default function FoodScannerPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <LiquidGlassContainer fullscreen>
      {/* GIF Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/branding/scanner- video.gif"
          alt="Scanner background"
          className="w-full h-full object-cover opacity-25"
        />
      </div>

      {/* Scanner Client Component */}
      <div className="relative z-10">
        <ScannerUnifiedClient locale={locale} />
      </div>
    </LiquidGlassContainer>
  );
}
