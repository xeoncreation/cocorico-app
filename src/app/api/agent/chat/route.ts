import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { agentMonitor } from '@/lib/agent/agent-monitor';

export const maxDuration = 30;
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Convertir mensajes de UIMessage a ModelMessage
    const convertedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: typeof msg.content === 'string' 
        ? msg.content 
        : msg.parts?.map((p: any) => p.text).join('') || ''
    }));

    const result = streamText({
      model: openai('gpt-4o'),
      system: `Eres el agente de asistencia de Cocorico, una aplicación de cocina con inteligencia artificial.

TU ROL:
- Ayudar a los usuarios con cualquier duda sobre la aplicación
- Explicar funcionalidades y guiar en el uso correcto
- Resolver problemas técnicos comunes
- Ser proactivo al detectar frustraciones o confusiones
- Si el usuario pregunta algo NO relacionado con Cocorico, responde brevemente y redirige sutilmente

FUNCIONALIDADES PRINCIPALES DE COCORICO:
1. **Chat Unificado**: Conversar por texto o voz con el asistente culinario
2. **Scanner de Alimentos**: Escanear productos para ver información nutricional
3. **Mis Recetas**: Guardar, organizar y buscar recetas favoritas
4. **Comunidad**: Compartir recetas y descubrir contenido de otros usuarios
5. **Estadísticas**: Ver progreso, logros y métricas de uso
6. **Lista de Compra**: Gestionar ingredientes y productos
7. **Favoritos**: Marcar y acceder rápido a recetas preferidas
8. **Premium**: Funciones avanzadas (planeador de menús, análisis detallado, sin anuncios)

ESTILO DE COMUNICACIÓN:
- Amigable y cercano
- Conciso pero completo
- Usa emojis ocasionalmente (🐓, 🍳, 💡, ✨)
- Proporciona ejemplos prácticos
- Ofrece tips útiles

IMPORTANTE:
- Si detectas un problema técnico, menciónalo con empatía
- Sugiere alternativas o workarounds cuando sea posible
- Si algo no funciona como debería, tranquiliza al usuario`,
      messages: convertedMessages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in agent chat:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar el mensaje' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
