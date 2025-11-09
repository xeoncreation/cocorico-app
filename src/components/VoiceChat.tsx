"use client";
import { useEffect, useRef, useState } from "react";
import { sttTranscribe, ttsSpeak } from "@/services/voice";
import AvatarCocorico from "./AvatarCocorico";

type PItem = { start: number; end: number; viseme: string };

export default function VoiceChat() {
  const [recording, setRecording] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [phonemes, setPhonemes] = useState<PItem[]>([]);
  const [lastText, setLastText] = useState("");
  const mediaRec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

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
  }

  async function stopRec() {
    mediaRec.current?.stop();
    setRecording(false);
  }

  async function onStop() {
    setThinking(true);
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

      await ttsSpeak(answer, {
        provider: "elevenlabs",
        onPhonemes: (tl) => setPhonemes(tl),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_260px]">
      <div className="p-4 rounded-xl border bg-white/60 dark:bg-neutral-900/60">
        <h3 className="font-semibold mb-2">Chat de voz con Cocorico</h3>
        <p className="text-sm text-neutral-500">Pulsa grabar, habla, y espera la respuesta con voz y animación.</p>

        <div className="mt-4 flex gap-3">
          {!recording ? (
            <button onClick={startRec} className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600">
              🎙️ Grabar
            </button>
          ) : (
            <button onClick={stopRec} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
              ⏹️ Detener
            </button>
          )}
          {thinking && <span className="text-sm">Pensando…</span>}
        </div>

        {lastText && (
          <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
            <div className="font-medium mb-1">Tú dijiste:</div>
            <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800">{lastText}</div>
          </div>
        )}
      </div>

      <div className="p-2 relative">
        <AvatarCocorico phonemes={phonemes} />
      </div>
    </div>
  );
}
