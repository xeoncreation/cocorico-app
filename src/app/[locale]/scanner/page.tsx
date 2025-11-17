import { Metadata } from "next";
import ScannerClient from "./scanner-client";

export const metadata: Metadata = {
  title: "Food Scanner | Cocorico",
  description: "Escanea alimentos con tu cámara o sube imágenes para identificarlos y obtener información nutricional.",
};

export default function FoodScannerPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2EC4B6] to-[#FFD166] bg-clip-text text-transparent">
          Food Scanner
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          Identifica alimentos en tiempo real con tu cámara o sube una foto para descubrir sus valores nutricionales.
        </p>
      </header>

      <ScannerClient />
    </main>
  );
}
