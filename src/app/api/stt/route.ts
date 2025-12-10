import { NextResponse } from "next/server";
import { applyRateLimit, RateLimitPresets } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // ⚠️ SECURITY: Rate limiting mejorado
  const rateLimitResult = await applyRateLimit(req, {
    prefix: 'api:stt',
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

  const data = await req.formData();
  const file = data.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });

  try {
    // Solo usar OpenAI (proveedor más confiable)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });

    const form = new FormData();
    form.append("model", "whisper-1");
    form.append("file", file, "audio.webm");

    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    
    if (!r.ok) {
      return NextResponse.json({ error: "STT failed", detail: await r.text() }, { status: 500 });
    }
    
    const j = await r.json();
    return NextResponse.json({ text: j.text || "" });
  } catch (e: any) {
    console.error("STT error:", e);
    return NextResponse.json({ error: "STT internal error" }, { status: 500 });
  }
}
