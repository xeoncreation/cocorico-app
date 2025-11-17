"use client";
import { useEffect, useRef, useState } from "react";
import { sttTranscribe, ttsSpeak } from "@/services/voice";
import CocoricoMascot, { useMascotMood } from "./CocoricoMascot";

type PItem = { start: number; end: number; viseme: string };

export default function VoiceChat() {
  const [recording, setRecording] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [phonemes, setPhonemes] = useState<PItem[]>([]);
  const [lastText, setLastText] = useState("");
  const [lastAnswer, setLastAnswer] = useState("");
  const mediaRec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const { mood, setMood } = useMascotMood("default");

  useEffect(() => {
    return () => {
      if (mediaRec.current && mediaRec.current.state !== "inactive") {
        mediaRec.current.stop();
      }
    };
  }, []);

  async function startRec() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
    chunks.current = [];
    mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
    mr.onstop = onStop;
    mr.start();
    mediaRec.current = mr;
    setRecording(true);
    setMood("alert");
  }

  async function stopRec() {
    mediaRec.current?.stop();
    setRecording(false);
  }

  async function onStop() {
    setThinking(true);
    setMood("thinking");
    try {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const text = await sttTranscribe(blob, "openai");
      setLastText(text);

      // Llamar a tu /api/chat
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const j = await res.json();
      const answer = j.answer || "No pude generar respuesta.";
      setLastAnswer(answer);

      setMood("happy", 1000);
      await ttsSpeak(answer, {
        provider: "elevenlabs",
        onPhonemes: (tl) => setPhonemes(tl),
      });
      setMood("default");
    } catch (e) {
      console.error(e);
      setMood("alert", 2000);
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <div className="p-6 rounded-xl border border-pink-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-pink-800/40 space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-pink-900 dark:text-pink-300 mb-2">
            Chat de voz con Cocorico
          </h3>
          <p className="text-sm text-muted-foreground">
            Pulsa grabar, habla, y espera la respuesta con voz y animación.
          </p>
        </div>

        <div className="flex gap-3">
          {!recording ? (
            <button 
              onClick={startRec} 
              className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 transition flex items-center gap-2"
            >
              🎙️ Grabar
            </button>
          ) : (
            <button 
              onClick={stopRec} 
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition flex items-center gap-2 animate-pulse"
            >
              ⏹️ Detener
            </button>
          )}
          {thinking && (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              Pensando…
            </span>
          )}
        </div>

        {lastText && (
          <div className="space-y-3">
            <div className="text-sm">
              <div className="font-medium mb-1 text-pink-900 dark:text-pink-300">Tú dijiste:</div>
              <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-neutral-700 dark:text-neutral-300">
                {lastText}
              </div>
            </div>
            {lastAnswer && (
              <div className="text-sm">
                <div className="font-medium mb-1 text-pink-900 dark:text-pink-300">Cocorico responde:</div>
                <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {lastAnswer}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-pink-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-pink-800/40">
        <CocoricoMascot
          mood={mood}
          size="xl"
          animated
          showBubble={recording || thinking}
          bubbleText={recording ? "🎙️ Te escucho..." : thinking ? "Pensando..." : ""}
        />
      </div>
    </div>
  );
}
