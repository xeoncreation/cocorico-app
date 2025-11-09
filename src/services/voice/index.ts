// Adaptador agnóstico: expone sttTranscribe() y ttsSpeak()
// IA de Supabase: respeta los nombres y signatures

import * as provEleven from "./providers/elevenlabs";
import * as provOpenAI from "./providers/openai";
import * as provBrowser from "./providers/browser";

export type STTProvider = "openai" | "browser";
export type TTSProvider = "elevenlabs" | "openai" | "browser";

export interface TTSSpeakOptions {
  provider?: TTSProvider;
  voiceId?: string; // ElevenLabs u OpenAI
  onPhonemes?: (items: Array<{ start: number; end: number; viseme: string }>) => void;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
}

export async function sttTranscribe(audioBlob: Blob, provider: STTProvider = "openai"): Promise<string> {
  if (provider === "browser") return provBrowser.sttTranscribe(audioBlob);
  return provOpenAI.sttTranscribe(audioBlob); // Whisper por defecto
}

export async function ttsSpeak(text: string, opts: TTSSpeakOptions = {}) {
  const provider = opts.provider || "elevenlabs";
  if (provider === "browser") return provBrowser.ttsSpeak(text, opts);
  if (provider === "openai") return provOpenAI.ttsSpeak(text, opts);
  return provEleven.ttsSpeak(text, opts);
}
