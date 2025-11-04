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

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function init() {
      try {
        const loaded = await cocoSsd.load();
        setModel(loaded);
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e: any) {
        setError(e?.message || "No se pudo iniciar la cámara o el modelo");
      }
    }
    init();
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!model) return;
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
  }, [model, onDetect, mode]);

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-neutral-900">
      <video ref={videoRef} autoPlay muted playsInline width={640} height={360} className="rounded-lg w-full h-auto" />
      <p className="text-sm text-neutral-500 mt-2">{error || "Detectando ingredientes..."}</p>
    </div>
  );
}
