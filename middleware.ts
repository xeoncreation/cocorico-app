import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

// Middleware de i18n
const intlMiddleware = createIntlMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
});

function withSecurityHeaders(res: NextResponse, isDev = process.env.NODE_ENV !== "production") {
  // Security headers — keep stricter ones for production to avoid dev issues
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  // HSTS: only meaningful on HTTPS, safe to always send
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // Content Security Policy (relajado en dev, más estricto en prod)
  const csp = [
    "default-src 'self'",
    // Next.js dev features y Umami
    `script-src 'self' https://cloud.umami.is ${isDev ? "'unsafe-eval' 'unsafe-inline'" : ""}`.trim(),
    // Permitir estilos inline generados por Tailwind/Next
    "style-src 'self' 'unsafe-inline'",
    // Cargas de imágenes locales y datos embebidos
    "img-src 'self' data: blob:",
    // Conexiones a APIs externas: Supabase (*.supabase.co), Umami, OpenAI, Replicate, Stripe, WebSocket dev
    `connect-src 'self' https://*.supabase.co https://cloud.umami.is https://api.openai.com https://api.replicate.com https://api.stripe.com ${isDev ? "ws: wss:" : ""}`.trim(),
    // Fuentes locales y data URIs
    "font-src 'self' data:",
    // Evitar incrustaciones no deseadas
    "frame-ancestors 'none'",
    // Permitir media locales
    "media-src 'self' blob:",
    // Workers y blobs
    "worker-src 'self' blob:",
    // Formularios solo a self (Stripe checkout embebido si se usa iframes se gestiona aparte)
    "form-action 'self' https://checkout.stripe.com"
  ].join("; ");
  res.headers.set("Content-Security-Policy", csp);
  // COEP/COOP/CORP may break some dev tooling; scope to production
  if (!isDev) {
    res.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  }
  return res;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas públicas que no requieren contraseña
  const publicPaths = [
    '/access',
    '/api/verify-password',
    '/health',
    '/_next',
    '/static',
    '/favicon.ico',
    '/manifest.webmanifest',
    '/robots.txt',
    '/sitemap.xml',
  ];

  // Verificar si la ruta es pública
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  // Hacer públicas únicamente las home localizadas y la raíz
  // Considerar también páginas directas localizadas sin segmento adicional
  const isLocaleHome = pathname === '/' || /^\/(es|en)$/.test(pathname);
  
  // Verificar si hay contraseña configurada
  const sitePassword = process.env.SITE_PASSWORD;
  const invitePassword = process.env.INVITE_PASSWORD;
  
  // Si no hay contraseña configurada o es ruta pública, solo aplicar i18n
  if (!sitePassword || isPublicPath || isLocaleHome) {
    const res = intlMiddleware(request);
    return withSecurityHeaders(res);
  }

  // Verificar cookie de acceso (puede ser site-access o invite-access)
  const hasSiteAccess = request.cookies.get('site-access')?.value === 'granted';
  const hasInviteAccess = request.cookies.get('invite-access')?.value === 'granted';

  // Verificar si viene con key de invitado en URL
  const inviteKey = request.nextUrl.searchParams.get('key');
  if (inviteKey && invitePassword && inviteKey === invitePassword) {
    // Otorgar acceso temporal de invitado
    const res = intlMiddleware(request);
    res.cookies.set('invite-access', 'granted', { 
      maxAge: 86400, // 24 horas
      httpOnly: true,
      sameSite: 'lax',
    });
    return withSecurityHeaders(res);
  }

  if (!hasSiteAccess && !hasInviteAccess) {
    // Redirigir a página de acceso con returnUrl
    const accessUrl = new URL('/access', request.url);
    accessUrl.searchParams.set('returnUrl', pathname);
    const redirectRes = NextResponse.redirect(accessUrl);
    return withSecurityHeaders(redirectRes);
  }

  // Usuario tiene acceso, aplicar i18n
  const res = intlMiddleware(request);
  return withSecurityHeaders(res);
}

export const config = {
  // Excluye API, assets, _next, archivos con extensión y health
  matcher: ["/((?!api|_next|static|health|.*\\..*).*)"],
};
