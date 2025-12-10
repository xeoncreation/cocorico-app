/**
 * Rate Limiting utility
 * Implementación simple en memoria para proteger APIs de abuso
 * 
 * NOTA: En producción con múltiples instancias serverless (Vercel),
 * considerar usar Redis o Upstash para compartir estado entre lambdas.
 * Esta implementación funciona para desarrollo y producción básica.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Limpiar entradas antiguas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Máximo número de peticiones permitidas
   */
  max: number;
  /**
   * Ventana de tiempo en milisegundos
   */
  windowMs: number;
  /**
   * Mensaje de error personalizado
   */
  message?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Verificar rate limit para una clave (IP, userId, etc.)
 * 
 * @example
 * ```ts
 * const { allowed, remaining } = checkRateLimit('api:login:' + ip, {
 *   max: 5,
 *   windowMs: 15 * 60 * 1000 // 15 minutos
 * });
 * 
 * if (!allowed) {
 *   return new Response('Too many requests', { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Si no existe o expiró, crear nueva entrada
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: config.max - 1,
      resetAt
    };
  }

  // Incrementar contador
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: entry.count <= config.max,
    remaining: Math.max(0, config.max - entry.count),
    resetAt: entry.resetAt
  };
}

/**
 * Presets de configuración para diferentes tipos de endpoints
 */
export const RateLimitPresets = {
  /**
   * Auth endpoints (login, signup, reset password)
   * 5 intentos cada 15 minutos
   */
  auth: {
    max: 5,
    windowMs: 15 * 60 * 1000,
    message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.'
  },

  /**
   * APIs de IA (chat, análisis, generación)
   * 20 peticiones por minuto
   */
  ai: {
    max: 20,
    windowMs: 60 * 1000,
    message: 'Límite de peticiones excedido. Espera un momento.'
  },

  /**
   * APIs de escaneo (barcode, nutrición)
   * 30 peticiones por minuto
   */
  scan: {
    max: 30,
    windowMs: 60 * 1000,
    message: 'Demasiados escaneos. Espera un momento.'
  },

  /**
   * APIs generales
   * 100 peticiones por minuto
   */
  general: {
    max: 100,
    windowMs: 60 * 1000,
    message: 'Límite de peticiones excedido.'
  },

  /**
   * Webhooks (Stripe, etc.)
   * 1000 peticiones por minuto (muy alto, solo para verificación de spam)
   */
  webhook: {
    max: 1000,
    windowMs: 60 * 1000,
    message: 'Webhook rate limit exceeded.'
  }
} as const;

/**
 * Obtener IP del cliente desde Request
 */
export function getClientIP(request: Request): string {
  // Vercel/Cloudflare
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  // Fallback
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  return 'unknown';
}

/**
 * Middleware helper para aplicar rate limiting en route handlers
 * 
 * @example
 * ```ts
 * export async function POST(req: Request) {
 *   const rateLimitResult = await applyRateLimit(req, {
 *     prefix: 'api:login',
 *     config: RateLimitPresets.auth
 *   });
 * 
 *   if (!rateLimitResult.allowed) {
 *     return new Response('Too Many Requests', { 
 *       status: 429,
 *       headers: rateLimitResult.headers
 *     });
 *   }
 * 
 *   // Continuar con lógica...
 * }
 * ```
 */
export async function applyRateLimit(
  request: Request,
  options: { prefix: string; config: RateLimitConfig }
): Promise<RateLimitResult & { headers: Record<string, string> }> {
  const ip = getClientIP(request);
  const key = `${options.prefix}:${ip}`;
  
  const result = checkRateLimit(key, options.config);

  const headers = {
    'X-RateLimit-Limit': options.config.max.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetAt).toISOString()
  };

  return { ...result, headers };
}
