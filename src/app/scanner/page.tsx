"use client";

import { useState } from "react";
import BarcodeScanner from "@/components/scanner/BarcodeScanner";
import ProductCard from "@/components/scanner/ProductCard";
import type { NormalizedProduct } from "@/lib/scan/types";

type ScanResult = (NormalizedProduct & { cocorico_score: number }) | null;

export default function ScannerPage() {
  const [product, setProduct] = useState<ScanResult>(null);
  const [loading, setLoading] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleScan(code: string) {
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

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#f97316_0,_#1e293b_45%,_#020617_100%)] text-white">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-3xl font-extrabold mb-2 drop-shadow-lg">
          Cocorico Scan
        </h1>
        <p className="text-sm text-white/80 mb-4">
          Escanea el código de barras de un producto para ver su puntuación Cocorico.
        </p>

        <BarcodeScanner onScan={handleScan} />

        {loading && (
          <div className="mt-4 text-sm text-white/80">
            Analizando producto…
          </div>
        )}

        {error && (
          <div className="mt-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {product && !loading && (
          <ProductCard product={product} />
        )}
      </div>
    </div>
  );
}
