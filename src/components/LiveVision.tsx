"use client";
import { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

type Mode = "local" | "cloud";

export default function LiveVision({ onDetect, mode = "local" }: { onDetect: (labels: string[]) => void; mode?: Mode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [permissionState, setPermissionState] = useState<"idle" | "requesting" | "granted" | "denied">("idle");

  async function requestCameraAccess() {
    setPermissionState("requesting");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissionState("granted");
      return stream;
    } catch (e: any) {
      setPermissionState("denied");
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setError("Acceso a la cámara denegado. Por favor, permite el acceso en la configuración de tu navegador.");
      } else if (e.name === "NotFoundError") {
        setError("No se encontró ninguna cámara en tu dispositivo.");
      } else {
        setError(e?.message || "No se pudo acceder a la cámara");
      }
      throw e;
    }
  }

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function init() {
      try {
        const loaded = await cocoSsd.load();
        setModel(loaded);
        // NO iniciamos la cámara automáticamente, esperamos click del usuario
      } catch (e: any) {
        setError(e?.message || "No se pudo cargar el modelo de visión");
      }
    }
    init();
    return () => {
      const video = videoRef.current;
      if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!model || permissionState !== "granted") return;
    const interval = setInterval(async () => {
      if (!videoRef.current) return;
      try {
        if (mode === "local") {
          const predictions = await model.detect(videoRef.current);
          const labels = predictions.map((p: any) => p.class as string);
          onDetect(Array.from(new Set(labels)));
        } else {
          const v = videoRef.current;
          if (!v.videoWidth || !v.videoHeight) return;
          let canvas = canvasRef.current;
          if (!canvas) {
            canvas = document.createElement("canvas");
          }
          canvas.width = v.videoWidth;
          canvas.height = v.videoHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
          const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve as any, "image/jpeg", 0.8));
          if (!blob) return;
          const form = new FormData();
          form.append("image", blob, "frame.jpg");
          const res = await fetch("/api/ai/live-vision", { method: "POST", body: form });
          if (!res.ok) return;
          const data = await res.json();
          const labels: string[] = Array.from(new Set((data.ingredients || []).filter(Boolean)));
          if (labels.length) onDetect(labels);
        }
      } catch {}
    }, 2000);
    return () => clearInterval(interval);
  }, [model, onDetect, mode, permissionState]);

  if (permissionState === "idle" || permissionState === "requesting") {
    return (
      <div className="p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-gradient-to-br from-orange-50/40 to-yellow-50/40 dark:from-neutral-800 dark:to-neutral-800 flex flex-col items-center justify-center text-center gap-4 min-h-[320px]">
        <div className="text-6xl">📸</div>
        <div>
          <h3 className="font-semibold text-lg mb-1">Activar Cámara en Vivo</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
            Para detectar ingredientes en tiempo real, necesitamos acceso a tu cámara.
            Haz clic en el botón y acepta el permiso cuando tu navegador lo solicite.
          </p>
        </div>
        <button
          onClick={requestCameraAccess}
          disabled={permissionState === "requesting"}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {permissionState === "requesting" ? "⏳ Esperando permiso..." : "🎥 Activar Cámara"}
        </button>
        {error && (
          <div className="mt-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (permissionState === "denied") {
    return (
      <div className="p-8 border-2 border-red-300 dark:border-red-800 rounded-xl bg-red-50/40 dark:bg-red-900/10 flex flex-col items-center justify-center text-center gap-4 min-h-[320px]">
        <div className="text-6xl">🚫</div>
        <div>
          <h3 className="font-semibold text-lg mb-1 text-red-800 dark:text-red-300">Acceso Denegado</h3>
          <p className="text-sm text-red-700 dark:text-red-400 max-w-md">
            {error || "No pudimos acceder a la cámara. Verifica los permisos en la configuración de tu navegador."}
          </p>
        </div>
        <button
          onClick={() => {
            setPermissionState("idle");
            setError("");
          }}
          className="px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
        >
          🔄 Intentar de Nuevo
        </button>
        <details className="mt-2 max-w-md">
          <summary className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200">
            ¿Cómo habilitar la cámara?
          </summary>
          <div className="mt-2 text-xs text-left text-neutral-600 dark:text-neutral-400 space-y-1">
            <p><strong>Chrome/Edge:</strong> Click en el icono 🔒 junto a la URL → Permisos del sitio → Cámara → Permitir</p>
            <p><strong>Firefox:</strong> Click en 🔒 → Borrar permisos y recarga → Click en Activar Cámara</p>
            <p><strong>Safari:</strong> Safari → Preferencias → Sitios web → Cámara → Permitir para este sitio</p>
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-neutral-900 shadow-sm">
      <video ref={videoRef} autoPlay muted playsInline width={640} height={360} className="rounded-lg w-full h-auto bg-black" />
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-neutral-500">{error || "🟢 Detectando ingredientes en vivo..."}</p>
        <button
          onClick={() => {
            const video = videoRef.current;
            if (video?.srcObject) {
              (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
              video.srcObject = null;
            }
            setPermissionState("idle");
          }}
          className="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
        >
          ⏹️ Detener
        </button>
      </div>
    </div>
  );
}
