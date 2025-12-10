import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;
export const runtime = 'edge';

const AnalysisSchema = z.object({
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  shouldAlert: z.boolean(),
  analysis: z.string(),
  suggestedFix: z.string(),
  possibleCauses: z.array(z.string()),
  relatedEvents: z.array(z.string()),
});

export async function POST(req: Request) {
  try {
    const { event, recentEvents } = await req.json();

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: AnalysisSchema,
      system: `Eres un agente IA experto en debugging de aplicaciones Next.js + React + Supabase + TypeScript.

TUS CAPACIDADES:
- Analizar errores de JavaScript/TypeScript
- Identificar patrones en múltiples eventos
- Sugerir soluciones específicas y accionables
- Determinar la severidad real del problema
- Detectar si requiere atención inmediata del desarrollador

CRITERIOS PARA shouldAlert=true:
- Errores de autenticación o base de datos
- Errores que afectan a múltiples usuarios
- Patrones de errores repetidos (>3 veces)
- Errores en funciones críticas (pago, registro, etc.)
- Errores de seguridad

FORMATO DE RESPUESTAS:
- analysis: Explicación clara del problema
- suggestedFix: Código o pasos específicos para resolver
- possibleCauses: Lista de causas probables
- relatedEvents: IDs de eventos relacionados del contexto`,
      prompt: `Analiza este error y los eventos recientes:

ERROR PRINCIPAL:
${JSON.stringify(event, null, 2)}

EVENTOS RECIENTES (contexto):
${JSON.stringify(recentEvents, null, 2)}

TAREAS:
1. ¿Cuál es la severidad real? (low/medium/high/critical)
2. ¿Requiere alerta inmediata al desarrollador? (solo si es crítico)
3. ¿Cuál es la causa más probable?
4. ¿Qué solución específica recomiendas?
5. ¿Hay patrones en los eventos recientes?`,
    });

    return Response.json(object);
  } catch (error) {
    console.error('Error in agent analyze:', error);
    return Response.json(
      { error: 'Failed to analyze error' },
      { status: 500 }
    );
  }
}
