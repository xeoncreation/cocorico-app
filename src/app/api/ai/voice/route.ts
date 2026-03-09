import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { applyRateLimit, getRateLimitIdentifier, getClientIP } from '@/lib/rate-limiter';

// Precomputed tiny silent MP3 (approx 0.1s) as Base64 to use as dev fallback
const SILENT_MP3_BASE64 =
  "SUQzAwAAAAAAAEZBSUYAAACAAACkAAACAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

export async function POST(req: NextRequest) {
  // 🔒 SEGURIDAD: Verificar autenticación
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Authentication required. Please login to use this feature.' },
      { status: 401 }
    );
  }
  
  // 🛡️ SEGURIDAD: Rate limiting (20 requests/hora por usuario)
  const ip = getClientIP(req.headers);
  const identifier = getRateLimitIdentifier(user.id, ip);
  const rateLimitResponse = await applyRateLimit(identifier, 'aiVoice');
  
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  // Continuar con el procesamiento original
  try {
    const { text } = await req.json();
    
    // Validar entrada
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Invalid text parameter" }, { status: 400 });
    }
    
    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text too long. Maximum 5000 characters allowed." },
        { status: 400 }
      );
    }
    
    if (!text.trim()) {
      return NextResponse.json({ error: "Texto vacío" }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      // Dev fallback: return short silent mp3
      const buf = Buffer.from(SILENT_MP3_BASE64, "base64");
      return new Response(buf, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
    }

    // Lazy import to avoid bundling in edge
    // @ts-expect-error elevenlabs-node package has no TS types
    const { ElevenLabsClient } = await import("elevenlabs-node");
    const client = new ElevenLabsClient({ apiKey });

    // Some SDKs differ; attempt convert, else throw to fallback
    const audio: any = await client.textToSpeech.convert({
      voice: "Bella",
      model_id: "eleven_monolingual_v1",
      text,
    });

    return new Response(audio as any, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      const buf = Buffer.from(SILENT_MP3_BASE64, "base64");
      return new Response(buf, { headers: { "Content-Type": "audio/mpeg", "X-Dev-Error": e?.message || "" } });
    }
    return NextResponse.json({ error: e?.message || "TTS error" }, { status: 500 });
  }
}
