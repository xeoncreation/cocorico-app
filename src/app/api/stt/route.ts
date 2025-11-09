import { NextResponse } from "next/server";
import { hit } from "@/utils/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider") || "openai";

  // Rate limiting
  const uid = "anon"; // TODO: si tienes user session, usa su id
  const rl = hit({ key: "voice-turns-daily", limit: 10, windowSec: 86400 }, uid);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfter: rl.retryAfter },
      { status: 429 }
    );
  }

  const data = await req.formData();
  const file = data.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });

  try {
    if (provider === "openai") {
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
    }

    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  } catch (e: any) {
    console.error("STT error:", e);
    return NextResponse.json({ error: "STT internal error" }, { status: 500 });
  }
}
