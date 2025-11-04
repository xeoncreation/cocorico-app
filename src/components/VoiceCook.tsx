"use client";
import { useState } from "react";

export default function VoiceCook({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  async function speak() {
    if (playing) {
      audio?.pause();
      setPlaying(false);
      return;
    }

    const res = await fetch("/api/ai/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const newAudio = new Audio(url);
    setAudio(newAudio);
    newAudio.play();
    setPlaying(true);

    newAudio.onended = () => setPlaying(false);
  }

  return (
    <button onClick={speak} className="flex items-center gap-2 text-orange-700 mt-2">
      {playing ? "⏹️ Detener lectura" : "🔊 Escuchar receta"}
    </button>
  );
}
