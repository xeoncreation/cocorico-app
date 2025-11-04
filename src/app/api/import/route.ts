import { NextResponse } from "next/server";
import { cleanRecipeText } from "@/lib/recipe-cleaner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const url = formData.get("url") as string | null;
    const image = formData.get("image") as File | null;
    let rawText = "";

    if (url) {
      const html = await fetch(url).then((r) => r.text());
      rawText = html;
    } else if (image) {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "Falta OPENAI_API_KEY para OCR" }, { status: 500 });
      }
      // OCR con OpenAI GPT-4o-mini
      const buffer = Buffer.from(await image.arrayBuffer());
      const base64 = buffer.toString("base64");
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Extrae texto de la imagen. Si contiene una receta, ordénala en formato limpio.",
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64}`,
                  },
                },
              ],
            },
          ],
        }),
      });
      const data = await res.json();
      rawText = data.choices?.[0]?.message?.content || "";
    } else {
      return NextResponse.json(
        { error: "Debes subir una imagen o pegar una URL" },
        { status: 400 }
      );
    }

    const cleanedText = await cleanRecipeText(rawText);
    return NextResponse.json({ cleanedText });
  } catch (err: any) {
    console.error("Error en import:", err);
    return NextResponse.json(
      { error: "Error al importar receta", detail: err.message },
      { status: 500 }
    );
  }
}
