import { TTSSpeakOptions } from "../index";

export async function sttTranscribe(_: Blob): Promise<string> {
  throw new Error("STT del navegador no implementado aquí. Usa /api/stt o Web Speech Recognition en el componente.");
}

export async function ttsSpeak(text: string, opts: TTSSpeakOptions = {}) {
  if (typeof window === "undefined") return;
  const u = new SpeechSynthesisUtterance(text);
  opts.onPhonemes?.(roughTimeline(text));
  opts.onAudioStart?.();
  u.onend = () => opts.onAudioEnd?.();
  speechSynthesis.speak(u);
}

function roughTimeline(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  let t = 0;
  return words.map((w) => {
    const dur = Math.max(120, Math.min(260, w.length * 45));
    const viseme = "A";
    const item = { start: t, end: t + dur, viseme };
    t += dur + 40;
    return item;
  });
}
