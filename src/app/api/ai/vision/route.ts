import OpenAI from "openai";
import { NextResponse } from "next/server";

// Force Node.js runtime to ensure Buffer and Node APIs are available during build/runtime
export const runtime = "nodejs";
// Avoid any static optimization attempts for this API route
export const dynamic = "force-dynamic";

export const maxDuration = 30; // seconds

export async function POST(req: Request) {
  try {
    // Initialize SDK at request-time to avoid build-time evaluation issues
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const form = await req.formData();
    const file = form.get("image") as File | null;
    if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // If no API key in dev, return a mock response
    if (!process.env.OPENAI_API_KEY && process.env.NODE_ENV !== "production") {
      return NextResponse.json({
        answer:
          "[DEV MOCK] Ingredientes detectados: tomate, cebolla, huevo.\nRecetas: 1) Tortilla, 2) Ensalada de tomate, 3) Shakshuka.",
      });
    }

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres Cocorico, experto en cocina. Identifica los ingredientes visibles y sugiere 3 recetas sencillas que los utilicen.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Describe la imagen y sugiere recetas con estos ingredientes:" },
            { type: "image_url" as const, image_url: { url: `data:image/jpeg;base64,${base64}` } },
          ] as any,
        },
      ],
      temperature: 0.5,
    });

    return NextResponse.json({ answer: res.choices[0]?.message?.content ?? "" });
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        {
          answer:
            "[DEV MOCK] Ingredientes detectados (simulado): tomate, cebolla, huevo. Recetas: Tortilla, Ensalada, Shakshuka.",
          error: e?.message,
        },
        { status: 200 }
      );
    }
    return NextResponse.json({ error: e?.message || "Vision error" }, { status: 500 });
  }
}
