import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { applyRateLimit, getRateLimitIdentifier, getClientIP } from '@/lib/rate-limiter';

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 🔒 SEGURIDAD: Verificar autenticación
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // 🛡️ SEGURIDAD: Rate limiting
    const ip = getClientIP(req.headers);
    const identifier = getRateLimitIdentifier(user.id, ip);
    const rateLimitResponse = await applyRateLimit(identifier, 'ai');
    
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    
    const { type, recipe } = await req.json();
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Falta OPENAI_API_KEY en el entorno" }, { status: 500 });
    }

    const systemPrompt = `Eres Cocorico, chef asistente con IA.
Responde en español, breve y amable.
Transforma la receta según el tipo indicado.
Formato:
Título adaptado
Ingredientes ajustados
Preparación adaptada
`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Tipo: ${type}\nReceta:\n${recipe}` },
        ],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

  const data = await res.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || "No se pudo generar sugerencia.";

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("Error en /api/suggest:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
