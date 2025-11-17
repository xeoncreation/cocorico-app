import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // TODO: Integrar con OpenAI Vision API o modelo de detección de objetos
    // Por ahora devolvemos datos mock
    const mockFoods = [
      {
        name: "Manzana",
        confidence: 0.92,
        nutrition: {
          calories: 95,
          protein: 0.5,
          carbs: 25,
          fat: 0.3,
        },
      },
      {
        name: "Plátano",
        confidence: 0.87,
        nutrition: {
          calories: 105,
          protein: 1.3,
          carbs: 27,
          fat: 0.4,
        },
      },
    ];

    // Simular tiempo de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      foods: mockFoods,
    });
  } catch (error) {
    console.error("[detect-food]", error);
    return NextResponse.json(
      { error: "Failed to detect food" },
      { status: 500 }
    );
  }
}
