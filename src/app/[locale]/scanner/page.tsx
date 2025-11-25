import { Metadata } from "next";
import ScannerUnifiedClient from "./scanner-unified-client";
import { AppBackground } from "@/components/layout/AppBackground";
import Wallpaper from "@/components/layout/Wallpaper";

export const metadata: Metadata = {
  title: "Food Scanner | Cocorico",
  description: "Escanea códigos de barras o fotografías de alimentos para obtener información nutricional instantánea y puntuación Cocorico.",
};

export default function FoodScannerPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <>
      <Wallpaper
        imageLight="/branding/SCAN_MODO_CLARO.jpg"
        imageDark="/branding/SCAN_MODO_OSCURO.jpg"
      />
      <AppBackground variantOverride="home-free">
        <ScannerUnifiedClient locale={locale} />
      </AppBackground>
    </>
  );
}
