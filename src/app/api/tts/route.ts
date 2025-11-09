import { NextResponse } from "next/server";
import { hit } from "@/utils/rate-limit";

export async function POST(req: Request) {
  // Rate limiting
  const uid = "anon"; // TODO: si tienes user session, usa su id
  const rl = hit({ key: "voice-turns-daily", limit: 10, windowSec: 86400 }, uid);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfter: rl.retryAfter },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const text = body?.text;
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  
  // Aquí podrías hacer TTS server-side y devolver audio. De momento, responde OK para debug.
  return NextResponse.json({ ok: true });
}
