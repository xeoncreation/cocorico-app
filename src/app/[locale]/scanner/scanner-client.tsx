"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassCard from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, Loader2, Info } from "lucide-react";
import CocoricoMascot, { useMascotMood } from "@/components/CocoricoMascot";
import { cn } from "@/lib/utils";

type DetectedFood = {
  name: string;
  confidence: number;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export default function ScannerClient() {
  const [mode, setMode] = useState<"idle" | "camera" | "upload">("idle");
  const [detecting, setDetecting] = useState(false);
  const [detectedFoods, setDetectedFoods] = useState<DetectedFood[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mood, setMood } = useMascotMood("default");

  const plan =
    typeof document !== "undefined"
      ? (document.documentElement.dataset.theme as "free" | "premium")
      : "free";

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setMode("camera");
      setMood("alert", 3000);
    } catch (error) {
      console.error("Camera access denied:", error);
      alert("No se pudo acceder a la cámara");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setMode("idle");
    setDetectedFoods([]);
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setDetecting(true);
    setMood("thinking", 5000);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
    }

    const imageData = canvas.toDataURL("image/jpeg");

    try {
      const response = await fetch("/api/ai/detect-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();
      setDetectedFoods(data.foods || []);
      setMood("happy", 3000);
    } catch (error) {
      console.error("Detection failed:", error);
      setMood("alert", 2000);
    } finally {
      setDetecting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDetecting(true);
    setMode("upload");
    setMood("thinking", 5000);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;

      try {
        const response = await fetch("/api/ai/detect-food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageData }),
        });

        const data = await response.json();
        setDetectedFoods(data.foods || []);
        setMood("happy", 3000);
      } catch (error) {
        console.error("Detection failed:", error);
        setMood("alert", 2000);
      } finally {
        setDetecting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50/80 via-white to-cyan-50/60 dark:from-teal-950/20 dark:via-neutral-900 dark:to-cyan-950/20 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header with Cocorico */}
        <div className="flex items-center justify-center gap-6">
          <div className="hidden md:block">
            <CocoricoMascot mood={mood} size="lg" animated />
          </div>
          <div className="text-center space-y-2">
            <h1 className={`text-4xl font-bold tracking-tight ${plan === "premium" ? "glass-text-premium" : "text-teal-900 dark:text-teal-300"}`}>
              Food Scanner
            </h1>
            <p className={`text-sm ${plan === "premium" ? "text-white/80" : "text-muted-foreground"} max-w-2xl mx-auto`}>
              Identifica alimentos en tiempo real con tu cámara o sube una foto para descubrir sus valores nutricionales.
            </p>
          </div>
          <div className="hidden md:block opacity-0">
            {/* Spacer for symmetry */}
            <div className="w-32 h-32"></div>
          </div>
        </div>

      {/* Mode Selection */}
      {mode === "idle" && (
        <div className="grid md:grid-cols-2 gap-4">
          <GlassCard
            className={cn(
              "cursor-pointer hover:scale-105 transition border border-teal-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-teal-800/40",
              plan === "premium" && "glass-card-premium"
            )}
            onClick={startCamera}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Cámara en vivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Escanea alimentos en tiempo real con tu cámara
              </p>
            </CardContent>
          </GlassCard>

          <GlassCard
            className={cn(
              "cursor-pointer hover:scale-105 transition border border-teal-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-teal-800/40",
              plan === "premium" && "glass-card-premium"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Subir imagen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sube una foto desde tu galería
              </p>
            </CardContent>
          </GlassCard>
        </div>
      )}

      {/* Camera View */}
      {mode === "camera" && (
        <GlassCard
          className={cn(
            "overflow-hidden border border-teal-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-teal-800/40",
            plan === "premium" && "glass-card-premium"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vista de cámara</CardTitle>
            <Button variant="ghost" size="icon" onClick={stopCamera}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* AR Overlay Mascot */}
              <div className="absolute top-4 right-4">
                <CocoricoMascot mood={mood} size="sm" animated />
              </div>
            </div>

            <Button
              onClick={captureAndDetect}
              disabled={detecting}
              className="w-full"
            >
              {detecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Detectando...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Capturar y analizar
                </>
              )}
            </Button>
          </CardContent>
        </GlassCard>
      )}

      {/* Results */}
      {detectedFoods.length > 0 && (
        <GlassCard
          className={cn(
            "border border-teal-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-teal-800/40",
            plan === "premium" && "glass-card-premium"
          )}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Alimentos detectados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detectedFoods.map((food, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-4 rounded-xl border",
                  plan === "premium" && "bg-white/5 border-white/10"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{food.name}</h3>
                  <Badge variant="outline">
                    {Math.round(food.confidence * 100)}% confianza
                  </Badge>
                </div>

                {food.nutrition && (
                  <div className="grid grid-cols-4 gap-2 text-xs mt-3">
                    <div className="text-center">
                      <p className="font-semibold">{food.nutrition.calories}</p>
                      <p className="text-muted-foreground">kcal</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{food.nutrition.protein}g</p>
                      <p className="text-muted-foreground">proteína</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{food.nutrition.carbs}g</p>
                      <p className="text-muted-foreground">carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{food.nutrition.fat}g</p>
                      <p className="text-muted-foreground">grasa</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </GlassCard>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        aria-label="Subir imagen de alimentos"
      />
      </div>
    </div>
  );
}
