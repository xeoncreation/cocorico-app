import { NextResponse } from "next/server";
import { applyRateLimit, RateLimitPresets } from "@/lib/rate-limit";
import { getServerUser } from "@/lib/auth/server";
import { sttTranscribe } from "@/services/voice";

export const runtime = "nodejs";

/**
 * Voice Conversation API
 * 
 * Endpoint especializado para conversaciones de voz:
 * 1. Recibe audio del usuario
 * 2. Transcribe a texto (STT)
 * 3. Genera respuesta de IA
 * 4. Convierte respuesta a audio (TTS) si requestAudio=true
 * 5. Retorna texto + URL de audio
 */

export async function POST(req: Request) {
  // Rate limiting
  const rateLimitResult = await applyRateLimit(req, {
    prefix: 'api:voice-conversation',
    config: RateLimitPresets.ai
  });

  if (!rateLimitResult.allowed) {
    return new Response(
      JSON.stringify({ 
        error: 'rate_limit_exceeded', 
        message: RateLimitPresets.ai.message,
        retryAfter: Math.floor((rateLimitResult.resetAt - Date.now()) / 1000)
      }),
      { 
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...rateLimitResult.headers
        }
      }
    );
  }

  try {
    // Verificar autenticación
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const requestAudio = formData.get("requestAudio") === "true";
    const locale = (formData.get("locale") as string) || "es";

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file required" }, { status: 400 });
    }

    // 1. Transcribir audio a texto (STT)
    const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });
    const transcribedText = await sttTranscribe(audioBlob);

    if (!transcribedText) {
      return NextResponse.json({ 
        error: "No se pudo transcribir el audio" 
      }, { status: 400 });
    }

    // 2. Obtener respuesta de la IA
    const chatResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/chat`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": req.headers.get("Cookie") || "" // Forward auth cookies
      },
      body: JSON.stringify({
        message: transcribedText,
        voiceMode: true,
        locale
      }),
    });

    if (!chatResponse.ok) {
      return NextResponse.json({ 
        error: "Error al procesar el mensaje" 
      }, { status: 500 });
    }

    const chatData = await chatResponse.json();
    const aiResponseText = chatData.response || chatData.message || "";

    // 3. Generar audio de respuesta (TTS) si se solicita
    let audioUrl = null;
    
    if (requestAudio && aiResponseText) {
      try {
        // Llamar a API de TTS (ElevenLabs o alternativa)
        const ttsResponse = await generateTTS(aiResponseText, locale);
        audioUrl = ttsResponse.url;
      } catch (ttsError) {
        console.error("Error generando TTS:", ttsError);
        // No es crítico, continuamos sin audio
      }
    }

    return NextResponse.json({
      success: true,
      transcription: transcribedText,
      response: aiResponseText,
      audioUrl: audioUrl,
      hasAudio: !!audioUrl
    });

  } catch (error) {
    console.error("Voice conversation error:", error);
    return NextResponse.json({ 
      error: "Error interno del servidor" 
    }, { status: 500 });
  }
}

/**
 * Genera audio a partir de texto usando TTS
 */
async function generateTTS(text: string, locale: string): Promise<{ url: string }> {
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
  
  if (!elevenLabsKey) {
    throw new Error("ElevenLabs API key not configured");
  }

  // Seleccionar voz según idioma
  const voiceId = locale === "es" 
    ? "g5CIjZEefAph4nQFvHAz" // Espanol - Matilda
    : "21m00Tcm4TlvDq8ikWAM"; // English - Rachel

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": elevenLabsKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error("TTS generation failed");
  }

  // Convertir respuesta a base64 data URL para reproducción directa
  const audioBuffer = await response.arrayBuffer();
  const base64Audio = Buffer.from(audioBuffer).toString('base64');
  const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

  return { url: audioUrl };
}
