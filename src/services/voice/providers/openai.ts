// STT con Whisper (vía /api/stt) y TTS básico OpenAI si habilitas su TTS.
// Aquí dejemos STT real y TTS como fallback simple (o reusar browser).

import { TTSSpeakOptions } from "../index";

export async function sttTranscribe(audioBlob: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", audioBlob, "audio.webm");
  const res = await fetch("/api/stt?provider=openai", { method: "POST", body: form });
  if (!res.ok) throw new Error(`STT HTTP ${res.status}`);
  const data = await res.json();
  return data.text || "";
}

export async function ttsSpeak(text: string, opts: TTSSpeakOptions = {}) {
  // Si quieres OpenAI TTS puro, implementa aquí (Actualmente fallback a browser)
  const { ttsSpeak: browserSpeak } = await import("./browser");
  return browserSpeak(text, opts);
}
