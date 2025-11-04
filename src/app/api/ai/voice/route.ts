import { NextResponse } from "next/server";

// Precomputed tiny silent MP3 (approx 0.1s) as Base64 to use as dev fallback
const SILENT_MP3_BASE64 =
  "SUQzAwAAAAAAAEZBSUYAAACAAACkAAACAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Texto vacío" }, { status: 400 });

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      // Dev fallback: return short silent mp3
      const buf = Buffer.from(SILENT_MP3_BASE64, "base64");
      return new Response(buf, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
    }

    // Lazy import to avoid bundling in edge
    // @ts-ignore - elevenlabs-node lacks types
    const { ElevenLabsClient } = await import("elevenlabs-node");
    const client = new ElevenLabsClient({ apiKey });

    // Some SDKs differ; attempt convert, else throw to fallback
    // @ts-ignore
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
