export async function cleanRecipeText(raw: string): Promise<string> {
  // Simplifica HTML si viene de web
  const text = raw
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Usa IA para limpiarlo y estructurarlo
  if (!process.env.OPENAI_API_KEY) {
    // Si no hay API key, devolvemos el texto simplificado
    return text;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Eres un formateador de recetas. Devuelve el texto ordenado con formato:\n\nTítulo\nIngredientes:\n- lista\nPreparación:\n1. pasos\n",
        },
        { role: "user", content: text },
      ],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || text;
}
