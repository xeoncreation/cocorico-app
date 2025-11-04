"use client";
import { useState, useEffect } from "react";

export default function VoiceInput({ onResult }: { onResult: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).webkitSpeechRecognition) {
      const rec = new (window as any).webkitSpeechRecognition();
      rec.lang = "es-ES";
      rec.interimResults = false;
      rec.continuous = false;
      rec.onresult = (e: any) => {
        const text = e.results?.[0]?.[0]?.transcript || "";
        if (text) onResult(text);
        setRecording(false);
      };
      setRecognition(rec);
    }
  }, [onResult]);

  function start() {
    if (recognition) {
      recognition.start();
      setRecording(true);
    } else {
      alert("Tu navegador no soporta reconocimiento de voz.");
    }
  }

  return (
    <button
      onClick={start}
      className={`px-4 py-2 rounded-lg text-white ${recording ? "bg-green-600" : "bg-orange-600"}`}
    >
      {recording ? "🎙️ Escuchando..." : "Hablar con Cocorico"}
    </button>
  );
}
