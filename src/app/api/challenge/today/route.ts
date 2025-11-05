import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Supabase no disponible" }, { status: 500 });
    }

    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabaseServer
      .from("daily_challenges")
      .select("*")
      .eq("active_date", today)
      .maybeSingle();

    if (data) return NextResponse.json(data);

    // Generar nuevo reto con IA (instanciar cliente en tiempo de petición)
    const prompt = "Genera un reto de cocina divertido y saludable en español, con ingredientes variados. Responde solo con el reto en una frase corta y motivadora.";

    // Si no hay API key, usar fallback simple
    if (!process.env.OPENAI_API_KEY) {
      const fallback = "Cocina algo con garbanzos y limón 🍋";
      const { data: newChallenge } = await supabaseServer
        .from("daily_challenges")
        .insert({
          title: fallback.split(" ").slice(0, 5).join(" "),
          description: fallback,
          difficulty: "normal",
          reward_xp: 200,
          active_date: today,
        })
        .select()
        .maybeSingle();
      return NextResponse.json(newChallenge);
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const ai = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 100,
    });

    const text = ai.choices[0].message?.content || "Cocina algo saludable y sabroso 🌱";

    // Extraer título (primeras 5 palabras)
    const words = text.split(" ");
    const title = words.slice(0, 5).join(" ");

    const { data: newChallenge } = await supabaseServer
      .from("daily_challenges")
      .insert({
        title: title,
        description: text,
        difficulty: "normal",
        reward_xp: 200,
        active_date: today,
      })
      .select()
      .maybeSingle();

    return NextResponse.json(newChallenge);
  } catch (err: any) {
    console.error("Error generando reto diario:", err);
    return NextResponse.json({ error: "Error al generar reto" }, { status: 500 });
  }
}
