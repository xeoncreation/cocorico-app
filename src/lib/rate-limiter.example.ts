/**
 * 🔒 EJEMPLO DE IMPLEMENTACIÓN: Rate Limiting en API Costosa
 * 
 * Este archivo muestra cómo proteger tus endpoints de IA
 * con rate limiting y autenticación.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient as createClient } from '@/lib/supabase/server';
import { applyRateLimit, getRateLimitIdentifier, getClientIP } from '@/lib/rate-limiter';

// ============================================
// ANTES (VULNERABLE) ❌
// ============================================

/*
export async function POST(req: Request) {
  const { text } = await req.json();
  
  // ❌ PROBLEMA: Cualquiera puede usar esto sin límite
  // ❌ RIESGO: $50/hora en abuso de ElevenLabs
  
  const audio = await elevenLabs.textToSpeech(text);
  return new Response(audio, {
    headers: { "Content-Type": "audio/mpeg" }
  });
}
*/

// ============================================
// DESPUÉS (PROTEGIDO) ✅
// ============================================

export async function POST(req: NextRequest) {
  // PASO 1: Verificar autenticación
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  // PASO 2: Aplicar rate limiting
  const ip = getClientIP(req.headers);
  const identifier = getRateLimitIdentifier(user.id, ip);
  const rateLimitResponse = await applyRateLimit(identifier, 'aiVoice');
  
  if (rateLimitResponse) {
    // Rate limit excedido
    return rateLimitResponse;
  }
  
  // PASO 3: Validar entrada
  const body = await req.json();
  const { text } = body;
  
  if (!text || typeof text !== 'string') {
    return NextResponse.json(
      { error: 'Invalid text parameter' },
      { status: 400 }
    );
  }
  
  if (text.length > 5000) {
    return NextResponse.json(
      { error: 'Text too long (max 5000 characters)' },
      { status: 400 }
    );
  }
  
  // PASO 4: Procesar request de forma segura
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      // Fallback silencioso en desarrollo
      if (process.env.NODE_ENV !== 'production') {
        const silentAudio = Buffer.from('SUQz', 'base64'); // Mini MP3 silencioso
        return new Response(silentAudio, {
          headers: { "Content-Type": "audio/mpeg" }
        });
      }
      
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }
    
    // Llamar a ElevenLabs con límite de tiempo
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout
    
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/...', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        voice_settings: { stability: 0.5, similarity_boost: 0.5 }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.status}`);
    }
    
    const audioBuffer = await response.arrayBuffer();
    
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=3600', // Cache 1 hora
      }
    });
    
  } catch (error: any) {
    console.error('TTS Error:', error.message);
    
    // No revelar detalles internos al cliente
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}

// ============================================
// OTROS EJEMPLOS
// ============================================

/**
 * Ejemplo: Proteger endpoint de generación de recetas (/api/ai/recipes)
 */
export async function protectAIRecipes(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Rate limit: 10 generaciones por hora
  const ip = getClientIP(req.headers);
  const identifier = getRateLimitIdentifier(user.id, ip);
  const rateLimitResponse = await applyRateLimit(identifier, 'ai');
  
  if (rateLimitResponse) return rateLimitResponse;
  
  // Validar plan del usuario (opcional: premium tiene más límite)
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('plan')
    .eq('user_id', user.id)
    .single();
  
  if (userRole?.plan !== 'premium') {
    // Usuarios free tienen límite más estricto
    // Ya aplicamos rate limit general, aquí podrías aplicar otro adicional
  }
  
  // ... procesar generación de receta
}

/**
 * Ejemplo: Proteger endpoint de detección de alimentos (/api/ai/detect-food)
 */
export async function protectAIDetection(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Rate limit: 30 detecciones por hora
  const identifier = getRateLimitIdentifier(user.id);
  const rateLimitResponse = await applyRateLimit(identifier, 'aiDetection');
  
  if (rateLimitResponse) return rateLimitResponse;
  
  const { image } = await req.json();
  
  // Validar tamaño de imagen
  if (!image || typeof image !== 'string') {
    return NextResponse.json({ error: 'Invalid image' }, { status: 400 });
  }
  
  // Base64 típico: 1.37x el tamaño original
  // Limitar a 10MB de imagen original = ~13.7MB base64
  const maxBase64Size = 14 * 1024 * 1024;
  if (image.length > maxBase64Size) {
    return NextResponse.json(
      { error: 'Image too large (max 10MB)' },
      { status: 400 }
    );
  }
  
  // ... procesar detección
}

// ============================================
// CHECKLIST DE APLICACIÓN
// ============================================

/*

✅ ENDPOINTS QUE NECESITAN PROTECCIÓN INMEDIATA:

1. /api/ai/voice
   - applyRateLimit(identifier, 'aiVoice')
   - Validar longitud de texto
   - Verificar autenticación

2. /api/ai/recipes
   - applyRateLimit(identifier, 'ai')
   - Validar número de ingredientes
   - Verificar autenticación

3. /api/voice-conversation
   - applyRateLimit(identifier, 'aiVoice')
   - Es el más costoso (TTS + STT + GPT-4)
   - Verificar autenticación

4. /api/ai/detect-food
   - applyRateLimit(identifier, 'aiDetection')
   - Validar tamaño de imagen
   - Verificar autenticación

5. /api/suggest
   - applyRateLimit(identifier, 'ai')
   - Verificar autenticación

6. /api/stt
   - applyRateLimit(identifier, 'ai')
   - Validar tamaño de audio
   - Verificar autenticación

7. /api/tts
   - applyRateLimit(identifier, 'aiVoice')
   - Validar longitud de texto
   - Verificar autenticación

8. /api/feedback
   - applyRateLimit(identifier, 'public')
   - Anti-spam con hash de contenido

9. /api/community/posts
   - applyRateLimit(identifier, 'api')
   - Validar tamaño de upload
   - Verificar autenticación

*/
