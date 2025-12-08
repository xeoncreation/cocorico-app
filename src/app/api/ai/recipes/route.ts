import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { AIRecipeRequestSchema, validateRequest } from "@/lib/validation";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RecipeRequest {
  ingredients: string[];
  maxTime: number;
  difficulty: "easy" | "medium" | "hard";
  diet?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RecipeRequest = await req.json();
    
    // Validar request con Zod
    const validation = await validateRequest(AIRecipeRequestSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { ingredients, maxTime, difficulty, diet } = validation.data;

    const prompt = `Eres un chef experto. Crea una receta deliciosa y práctica siguiendo estos requisitos:

INGREDIENTES DISPONIBLES: ${ingredients.join(", ")}
TIEMPO MÁXIMO: ${maxTime} minutos
DIFICULTAD: ${difficulty}
${diet ? `RESTRICCIÓN DIETÉTICA: ${diet}` : ""}

Responde SOLO con un objeto JSON válido con esta estructura exacta:
{
  "title": "Nombre atractivo de la receta",
  "description": "Breve descripción apetitosa (1-2 líneas)",
  "servings": 4,
  "prepTime": "15 min",
  "cookTime": "20 min",
  "difficulty": "${difficulty}",
  "ingredients": [
    {"name": "ingrediente", "quantity": "cantidad con unidad"}
  ],
  "instructions": [
    "Paso 1 detallado",
    "Paso 2 detallado"
  ],
  "tips": [
    "Consejo útil 1",
    "Consejo útil 2"
  ]
}

REGLAS:
- USA SOLO los ingredientes mencionados o básicos de cocina (sal, aceite, agua)
- El tiempo TOTAL (prep + cook) debe ser <= ${maxTime} minutos
- Los pasos deben ser claros y numerados
- Incluye al menos 2-3 tips útiles
- Todas las cantidades en español con unidades métricas
- Si hay restricción dietética, respétala estrictamente`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Eres un chef profesional que crea recetas prácticas y deliciosas. Siempre respondes en formato JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content?.trim();

    if (!responseText) {
      throw new Error("No se recibió respuesta de la IA");
    }

    // Limpiar markdown code blocks si existen
    let jsonText = responseText;
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/, "").replace(/\n?```$/, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/, "").replace(/\n?```$/, "");
    }

    const recipe = JSON.parse(jsonText);

    return NextResponse.json({
      success: true,
      recipe,
    });
  } catch (error: any) {
    console.error("Error generando receta:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Error al procesar la respuesta de la IA" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Error al generar receta. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
