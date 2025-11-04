import { NextRequest, NextResponse } from 'next/server';
import { secureLog } from '@/utils/log';

// Simple in-memory brute-force limiter
const ATTEMPT_LIMIT = 5;
const IP_BLOCK_TIME = 15 * 60 * 1000; // 15 minutes
const attempts: Record<string, { count: number; time: number }> = {};

function getClientIp(req: NextRequest) {
  const xf = req.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0].trim();
  // Fallback markers for local dev
  return 'local';
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const now = Date.now();

    // Block if exceeded attempts and still within block window
    if (attempts[ip]?.count >= ATTEMPT_LIMIT && now - attempts[ip].time < IP_BLOCK_TIME) {
      await secureLog('access.blocked', { ip });
      return NextResponse.json(
        { error: 'Demasiados intentos, espera 15 min' },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const sitePassword = process.env.SITE_PASSWORD;

    // Si no hay contraseña configurada, permitir acceso
    if (!sitePassword) {
      return NextResponse.json({ success: true });
    }

    // Verificar contraseña
    if (password === sitePassword) {
      const response = NextResponse.json({ success: true });
      
      // Establecer cookie de sesión (válida por 7 días)
      response.cookies.set('site-access', 'granted', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: '/',
      });

      // Reset attempts on success
      if (attempts[ip]) delete attempts[ip];
      await secureLog('access.success', { ip });

      return response;
    }

    // Wrong password path
    attempts[ip] = { count: (attempts[ip]?.count || 0) + 1, time: now };
    await secureLog('access.failed', { ip, count: attempts[ip].count });
    return NextResponse.json(
      { error: 'Contraseña incorrecta' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
