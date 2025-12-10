/**
 * Servicios de voz para Cocorico
 * Incluye Speech-to-Text (STT) y Text-to-Speech (TTS)
 */

export type STTProvider = "openai" | "browser";
export type TTSProvider = "elevenlabs" | "browser";

interface TTSOptions {
  provider?: TTSProvider;
  voiceId?: string;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
}

/**
 * Speech-to-Text: Transcribe audio a texto
 * SECURITY: Siempre usa API route para evitar exponer claves
 */
export async function sttTranscribe(
  audioBlob: Blob,
  provider: STTProvider = "openai"
): Promise<string> {
  if (provider === "openai") {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");

      // ⚠️ SECURITY: Llamar a nuestra API route en lugar de OpenAI directamente
      const response = await fetch("/api/stt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error en transcripción con OpenAI");
      }

      const data = await response.json();
      return data.text || "";
    } catch (error) {
      console.error("Error con OpenAI STT, usando fallback:", error);
      return sttTranscribe(audioBlob, "browser");
    }
  }

  // Fallback: Web Speech API
  return new Promise((resolve, reject) => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      reject(new Error("Speech recognition no soportado"));
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: any) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.start();
  });
}

/**
 * Text-to-Speech: Convierte texto a audio y lo reproduce
 */
export async function ttsSpeak(
  text: string,
  options: TTSOptions = {}
): Promise<void> {
  const {
    provider = "elevenlabs",
    voiceId = "21m00Tcm4TlvDq8ikWAM", // Rachel voice (inglés neutro)
    onAudioStart,
    onAudioEnd,
  } = options;

  if (provider === "elevenlabs") {
    try {
      const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      
      if (!apiKey) {
        console.warn("ElevenLabs API key no configurada, usando fallback");
        return ttsSpeak(text, { ...options, provider: "browser" });
      }

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en síntesis de voz con ElevenLabs");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      if (onAudioStart) {
        audio.addEventListener("play", onAudioStart);
      }

      if (onAudioEnd) {
        audio.addEventListener("ended", onAudioEnd);
      }

      await audio.play();

      // Esperar a que termine
      return new Promise((resolve) => {
        audio.addEventListener("ended", () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        });
      });
    } catch (error) {
      console.error("Error con ElevenLabs TTS, usando fallback:", error);
      return ttsSpeak(text, { ...options, provider: "browser" });
    }
  }

  // Fallback: Web Speech API
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("Speech synthesis no soportado"));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    if (onAudioStart) {
      utterance.addEventListener("start", onAudioStart);
    }

    utterance.addEventListener("end", () => {
      if (onAudioEnd) onAudioEnd();
      resolve();
    });

    utterance.addEventListener("error", (event) => {
      reject(new Error(`Speech synthesis error: ${event.error}`));
    });

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Cancelar cualquier síntesis de voz en curso
 */
export function ttsStop(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
