// ElevenLabs streaming TTS con timeline de fonemas → lip-sync
// IA de Supabase: usa WebSocket client de ElevenLabs si está disponible; si no, fallback HTTP.
// El cliente web oficial puede variar; este ejemplo usa fetch TTS + marcas aproximadas si WS no está.

import { TTSSpeakOptions } from "../index";

const ELEVEN_API = "https://api.elevenlabs.io/v1";
const DEFAULT_VOICE = "Rachel"; // reemplazar por una voz de tu cuenta

function roughPhonemeTimeline(text: string): Array<{ start: number; end: number; viseme: string }> {
  // Fallback simple: sin WS; divide por sílabas aproximadas y mapea a visemas básicos
  const words = text.split(/\s+/).filter(Boolean);
  const timeline: Array<{ start: number; end: number; viseme: string }> = [];
  let t = 0;
  for (const w of words) {
    const dur = Math.max(120, Math.min(260, w.length * 45)); // ms aprox
    const viseme = pickViseme(w);
    timeline.push({ start: t, end: t + dur, viseme });
    t += dur + 40;
  }
  return timeline;
}

function pickViseme(word: string): string {
  const w = word.toLowerCase();
  if (/[fv]/.test(w)) return "FV";
  if (/[oóuú]/.test(w)) return "O";
  if (/[aá]/.test(w)) return "A";
  if (/[eéií]/.test(w)) return "E";
  if (/[mnbp]/.test(w)) return "M";
  return "I";
}

export async function ttsSpeak(text: string, opts: TTSSpeakOptions = {}) {
  const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.warn("ELEVENLABS_API_KEY no configurada, fallback a SpeechSynthesis");
    return fallbackSpeak(text, opts);
  }

  try {
    // Fallback HTTP (rápido de integrar). Para WS con phonemes reales, usar SDK oficial.
    const voice = opts.voiceId || DEFAULT_VOICE;
    const res = await fetch(`${ELEVEN_API}/text-to-speech/${voice}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.4, similarity_boost: 0.8 }
      }),
    });

    if (!res.ok) throw new Error(`TTS HTTP ${res.status}`);
    const arrayBuf = await res.arrayBuffer();
    const blob = new Blob([arrayBuf], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    opts.onPhonemes?.(roughPhonemeTimeline(text));
    opts.onAudioStart?.();

    const audio = new Audio(url);
    audio.onended = () => {
      opts.onAudioEnd?.();
      URL.revokeObjectURL(url);
    };
    await audio.play();
  } catch (e) {
    console.error("ElevenLabs TTS error:", e);
    return fallbackSpeak(text, opts);
  }
}

function fallbackSpeak(text: string, opts: TTSSpeakOptions = {}) {
  // Web Speech Synthesis API fallback
  if (typeof window === "undefined") return;
  const u = new SpeechSynthesisUtterance(text);
  opts.onPhonemes?.(roughPhonemeTimeline(text));
  opts.onAudioStart?.();
  u.onend = () => opts.onAudioEnd?.();
  speechSynthesis.speak(u);
}
