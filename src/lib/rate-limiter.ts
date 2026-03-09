/**
 * 🛡️ Global Rate Limiter
 * 
 * Proporciona rate limiting robusto para proteger APIs costosas
 * y prevenir abuso del sistema.
 * 
 * Instalación requerida:
 * npm install @upstash/ratelimit @upstash/redis
 * 
 * O alternativa in-memory para desarrollo:
 * npm install lru-cache
 */

import { NextResponse } from 'next/server';

// ============================================
// CONFIGURACIÓN
// ============================================

interface RateLimitConfig {
  requests: number;
  window: string; // '1 m', '1 h', '1 d'
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // APIs costosas (IA)
  ai: { requests: 10, window: '1 h' },
  aiVoice: { requests: 20, window: '1 h' },
  aiDetection: { requests: 30, window: '1 h' },
  
  // APIs regulares
  api: { requests: 100, window: '1 h' },
  
  // Endpoints públicos
  public: { requests: 20, window: '1 m' },
  
  // Auth endpoints
  auth: { requests: 5, window: '15 m' },
};

// ============================================
// IN-MEMORY RATE LIMITER (Desarrollo/Simple)
// ============================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

function parseWindow(window: string): number {
  const match = window.match(/^(\d+)\s*(m|h|d)$/);
  if (!match) throw new Error(`Invalid window format: ${window}`);
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: throw new Error(`Unknown unit: ${unit}`);
  }
}

/**
 * Rate limiter in-memory simple
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowMs = parseWindow(config.window);
  
  let entry = rateLimitStore.get(key);
  
  // Si no existe o expiró, crear nueva
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + windowMs
    };
  }
  
  // Incrementar contador
  entry.count++;
  rateLimitStore.set(key, entry);
  
  const success = entry.count <= config.requests;
  const remaining = Math.max(0, config.requests - entry.count);
  
  return {
    success,
    limit: config.requests,
    remaining,
    reset: entry.resetAt
  };
}

/**
 * Helper para aplicar rate limit en route handlers
 */
export async function applyRateLimit(
  identifier: string,
  limitType: keyof typeof RATE_LIMITS = 'api'
): Promise<NextResponse | null> {
  const config = RATE_LIMITS[limitType];
  
  const result = await checkRateLimit(identifier, config);
  
  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    
    return NextResponse.json(
      { 
        error: 'Rate limit exceeded',
        message: `Too many requests. Try again in ${retryAfter} seconds.`,
        retryAfter 
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(result.reset).toISOString(),
          'Retry-After': retryAfter.toString()
        }
      }
    );
  }
  
  return null; // Success, continue
}

/**
 * Obtener identifier único para el usuario/IP
 */
export function getRateLimitIdentifier(
  userId?: string,
  ip?: string
): string {
  // Preferir userId si está disponible
  if (userId) return `user:${userId}`;
  
  // Fallback a IP
  if (ip) return `ip:${ip}`;
  
  // Fallback extremo (no recomendado en producción)
  return 'anonymous';
}

/**
 * Extraer IP del request
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;
  
  return 'unknown';
}

// ============================================
// ALTERNATIVA: UPSTASH RATE LIMITER (Producción)
// ============================================

/**
 * Para producción, descomentar esto y usar Upstash Redis:
 * 
 * import { Ratelimit } from "@upstash/ratelimit";
 * import { Redis } from "@upstash/redis";
 * 
 * const redis = Redis.fromEnv();
 * 
 * export const aiRateLimiter = new Ratelimit({
 *   redis,
 *   limiter: Ratelimit.slidingWindow(10, "1 h"),
 *   analytics: true,
 *   prefix: "cocorico:ratelimit:ai"
 * });
 * 
 * export const apiRateLimiter = new Ratelimit({
 *   redis,
 *   limiter: Ratelimit.slidingWindow(100, "1 h"),
 *   analytics: true,
 *   prefix: "cocorico:ratelimit:api"
 * });
 * 
 * // Uso:
 * const { success } = await aiRateLimiter.limit(userId);
 * if (!success) {
 *   return new NextResponse('Rate limit exceeded', { status: 429 });
 * }
 */

// ============================================
// EXPORTAR CONFIGURACIÓN
// ============================================

export { RATE_LIMITS };
