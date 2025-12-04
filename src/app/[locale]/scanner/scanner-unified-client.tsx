"use client";

import { useState } from "react";
import BarcodeScanner from "@/components/scanner/BarcodeScanner";
import ProductCardYuka from "@/components/scanner/ProductCardYuka";
import type { NormalizedProduct } from "@/lib/scan/types";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, Scan, Sparkles } from "lucide-react";

type ScanResult = (NormalizedProduct & { cocorico_score: number }) | null;

type ScanMode = "barcode" | "camera" | "upload";

export default function ScannerUnifiedClient({ locale }: { locale: string }) {
  const [product, setProduct] = useState<ScanResult>(null);
  const [loading, setLoading] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ScanMode | null>(null);

  async function handleBarcodeScan(code: string) {
    if (code === lastCode) return;

    setLastCode(code);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/scan/${code}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json?.error || "Error al obtener información del producto.");
        setProduct(null);
      } else {
        setProduct(json);
      }
    } catch (err) {
      console.error(err);
      setError("Error de red al consultar el producto.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = () => {
    alert("Funcionalidad de análisis por foto próximamente. Por ahora, usa el escáner de código de barras.");
  };

  if (!mode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white text-4xl shadow-2xl">
            <Scan />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-cocorico-brown dark:text-amber-100 mb-3">
              Food Scanner
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Descubre qué tan saludable es tu comida escaneando el código de barras o analizando una foto
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Opción 1: Escanear código de barras */}
          <GlassCard 
            className="p-8 text-center hover:scale-105 transition-transform cursor-pointer group"
            onClick={() => setMode("barcode")}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform">
              <Scan />
            </div>
            <h3 className="text-2xl font-bold text-cocorico-brown dark:text-amber-100 mb-2">
              Escanear Código
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Usa tu cámara para escanear el código de barras del producto
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-cocorico-red dark:text-amber-400 font-semibold">
              <Camera className="w-4 h-4" />
              Acceso a cámara requerido
            </div>
          </GlassCard>

          {/* Opción 2: Subir foto */}
          <GlassCard 
            className="p-8 text-center hover:scale-105 transition-transform cursor-pointer group relative overflow-hidden"
            onClick={handleImageUpload}
          >
            <div className="absolute top-2 right-2">
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                PREMIUM
              </span>
            </div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform">
              <ImageIcon />
            </div>
            <h3 className="text-2xl font-bold text-cocorico-brown dark:text-amber-100 mb-2">
              Analizar Foto
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Sube una foto del producto o etiqueta nutricional
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              IA avanzada con visión
            </div>
          </GlassCard>
        </div>

        {/* Info adicional */}
        <div className="mt-12 text-center space-y-6">
          <GlassCard className="inline-block p-4 bg-blue-50 dark:bg-blue-950/20">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              <strong>💡 Consejo:</strong> Para mejores resultados, asegúrate de que el código de barras esté bien iluminado y enfocado
            </p>
          </GlassCard>

          <div className="flex justify-center">
            <Button variant="ghost" className="text-neutral-600 dark:text-neutral-400 hover:text-cocorico-brown dark:hover:text-amber-100" asChild>
              <a href={`/${locale}/scanner/history`}>
                Ver historial completo de escaneos →
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "barcode") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header con botón volver */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => { setMode(null); setProduct(null); setError(null); }}>
            ← Cambiar método
          </Button>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-cocorico-brown dark:text-amber-100">
              Escáner de Código de Barras
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              Apunta la cámara al código de barras del producto
            </p>
          </div>

          <BarcodeScanner onScan={handleBarcodeScan} />

          {loading && (
            <GlassCard className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cocorico-red mx-auto mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-300">
                Analizando producto con IA...
              </p>
            </GlassCard>
          )}

          {error && (
            <GlassCard className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-center">
                {error === "PRODUCT_NOT_FOUND" 
                  ? "❌ Producto no encontrado en nuestra base de datos. Intenta con otro código."
                  : error === "OFF_REQUEST_FAILED"
                  ? "⚠️ Error al conectar con la base de datos. Inténtalo de nuevo."
                  : `⚠️ ${error}`
                }
              </p>
            </GlassCard>
          )}

          {product && !loading && (
            <ProductCardYuka product={product} />
          )}
        </div>
      </div>
    );
  }

  return null;
}
