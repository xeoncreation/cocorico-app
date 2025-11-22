import { Metadata } from "next";
import ScannerUnifiedClient from "./scanner-unified-client";
import { AppBackground } from "@/components/layout/AppBackground";

export const metadata: Metadata = {
  title: "Food Scanner | Cocorico",
  description: "Escanea códigos de barras o fotografías de alimentos para obtener información nutricional instantánea y puntuación Cocorico.",
};

export default function FoodScannerPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <AppBackground variantOverride="home-free">
      <ScannerUnifiedClient locale={locale} />
    </AppBackground>
  );
}
