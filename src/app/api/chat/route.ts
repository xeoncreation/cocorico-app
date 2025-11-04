import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { ChatResponse } from "@/types/api";
import { validateMessage } from "@/utils/validation";
import { supabaseServer } from "@/lib/supabase-client";
import { getOrCreateThread, getShortMemory, getProfile, saveMessage } from "@/utils/ai";
import { canUseAI, incrementAI } from "@/utils/limits";

// Exponential backoff retry helper
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || res.status === 429) { // Don't retry on rate limits
        return res;
      }
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err as Error;
    }
    // Exponential backoff: 1s, 2s, 4s...
    await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
  }
  throw lastError;
}

// Modelo económico (ajústalo cuando tengas cuota)
const MODEL = "gpt-4o-mini"; // o "gpt-3.5-turbo" si prefieres

export async function POST(req: Request) {
  const startTime = Date.now();
  let statusCode = 500;
  let errorType = null;

  try {
    const body = await req.json();
    const validation = validateMessage(body.message);

    if (!validation.isValid) {
      statusCode = 400;
      errorType = 'invalid_input';
      return NextResponse.json({ 
        error: validation.error || "Mensaje inválido" 
      } as ChatResponse, { status: 400 });
    }

    // Verificar cliente de BD disponible
    const sb = supabaseServer;
    if (!sb) {
      statusCode = 500;
      errorType = 'db_not_configured';
      return NextResponse.json({ error: "Base de datos no configurada" }, { status: 500 });
    }

    // Verificar autenticación
    const { data: { user }, error: userErr } = await sb.auth.getUser();
    if (userErr || !user) {
      statusCode = 401;
      errorType = 'unauthorized';
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const message = validation.value!;

    // Límites (free vs premium)
    const limit = await canUseAI(user.id);
    if (!limit.ok) {
      statusCode = 429;
      errorType = 'limit_reached';
      return NextResponse.json({ error: "Has alcanzado el límite diario. Pásate a Premium para uso ilimitado." }, { status: 429 });
    }

    const threadId = await getOrCreateThread(user.id);
    const profile = await getProfile(user.id);
    const memory = await getShortMemory(threadId, user.id);

    // Guardamos mensaje del usuario (memoria)
    await saveMessage(threadId, user.id, "user", message);

    // System prompt con perfil
    const system = [
      `Eres Cocorico, un asistente de cocina amable y breve. Idioma: ${profile.language || 'es'}.`,
      `Dieta: ${profile.diet}. Alergias: ${(profile.allergies||[]).join(', ') || 'ninguna'}.`,
      `Evita ingredientes en 'dislikes': ${(profile.dislikes||[]).join(', ') || '—'}.`,
      `Objetivos: ${(profile.goals||[]).join(', ') || '—'}.`,
      profile.calories_target ? `Objetivo calórico diario aproximado: ${profile.calories_target} kcal.` : '',
      `No des diagnósticos médicos. Da sustituciones y versiones saludables cuando encaje.`
    ].filter(Boolean).join('\n');

    if (!process.env.OPENAI_API_KEY) {
      const fallback = `Ahora mismo no puedo generar una respuesta. Respuesta eco: ${message}`;
      await saveMessage(threadId, user.id, "assistant", fallback);
      statusCode = 200;
      return NextResponse.json({ answer: fallback });
    }

    const res = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 350,
        messages: [
          { role: "system", content: system },
          ...memory,
          { role: "user", content: message }
        ]
      })
    }, 2);

    if (!res.ok) {
      // Fallback amigable sin romper UX
      const detail = await res.text();
      console.error("OpenAI error:", detail);
      const fallback = `Lo siento — hay mucha carga ahora. Respuesta eco: ${message}`;
      await saveMessage(threadId, user.id, "assistant", fallback);
      statusCode = 200;
      return NextResponse.json({ answer: fallback });
    }

    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content?.trim() || "No he podido generar una respuesta.";
    await saveMessage(threadId, user.id, "assistant", answer);

    // Incrementa cuota si es free
    await incrementAI(user.id);

    statusCode = 200;
    return NextResponse.json({ answer, threadId });
  } catch (err: any) {
    // Log the error for debugging
    console.error('Error in /api/chat:', err);
    const detail = err?.message || String(err);
    errorType = err?.name || 'unknown';
    statusCode = 500;
    return NextResponse.json({
      error: "Error de servidor inesperado",
      detail
    } as ChatResponse, { status: 500 });
  } finally {
    // Log metrics
    const duration = Date.now() - startTime;
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      path: '/api/chat',
      statusCode,
      duration,
      errorType,
    }));
  }
}
