import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Check if OpenAI API key is configured
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (openaiKey && openaiKey.startsWith("sk-")) {
      // Use OpenAI Vision API
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Identifica todos los alimentos visibles en esta imagen. Para cada uno, proporciona: nombre en español, nivel de confianza (0-1), y estimación nutricional básica (calorías, proteína, carbohidratos, grasa por 100g). Responde en formato JSON: {\"foods\": [{\"name\": \"...\", \"confidence\": 0.9, \"nutrition\": {\"calories\": 95, \"protein\": 0.5, \"carbs\": 25, \"fat\": 0.3}}]}"
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: image,
                    },
                  },
                ],
              },
            ],
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content;
          
          try {
            const parsed = JSON.parse(content);
            return NextResponse.json({
              success: true,
              foods: parsed.foods || [],
              source: "openai-vision",
            });
          } catch {
            // If JSON parsing fails, return mock data
            console.warn("Failed to parse OpenAI response, using mock data");
          }
        }
      } catch (error) {
        console.error("[detect-food] OpenAI error:", error);
      }
    }

    // Fallback: Return mock data
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
      source: "mock-data",
    });
  } catch (error) {
    console.error("[detect-food]", error);
    return NextResponse.json(
      { error: "Failed to detect food" },
      { status: 500 }
    );
  }
}
