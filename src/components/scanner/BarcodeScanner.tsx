"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

type Props = {
  onScan: (code: string) => void;
};

export default function BarcodeScanner({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader();
    let cancelled = false;

    async function startScanner() {
      try {
        setIsScanning(true);
        setError(null);

        const controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result, err) => {
            if (cancelled) return;
            if (result) {
              const text = result.getText();
              setIsScanning(false);
              onScan(text);
            }
          }
        );
        
        controlsRef.current = controls;
      } catch (err: any) {
        console.error("Scanner error:", err);
        setError("No se pudo acceder a la cámara. Revisa permisos de navegador.");
        setIsScanning(false);
      }
    }

    startScanner();

    return () => {
      cancelled = true;
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [onScan]);

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-3xl overflow-hidden border border-white/30 bg-white/15 backdrop-blur-md">
        <video
          ref={videoRef}
          className="w-full h-[60vh] object-cover"
        />
      </div>
      <div className="text-sm text-white/80">
        {isScanning
          ? "Apunta la cámara al código de barras del producto."
          : "Escaneo detenido. Recarga la página para volver a intentar."}
        {error && (
          <div className="mt-1 text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
