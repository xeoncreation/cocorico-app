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
  // NOTA: Next.js requiere 'unsafe-inline' para scripts y estilos inline incluso en producción.
  // Para CSP estricto futuro, usar nonces/hashes generados por Next.js.
  const csp = [
    "default-src 'self'",
    // Next.js runtime scripts + Umami (mantener unsafe-inline por compatibilidad)
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is`,
    // Estilos inline generados por Tailwind/Next
    "style-src 'self' 'unsafe-inline'",
    // Imágenes locales, data URIs y blobs
    "img-src 'self' data: blob:",
    // Conexiones a APIs externas: Supabase, Umami, OpenAI, Replicate, Stripe
    `connect-src 'self' https://*.supabase.co https://cloud.umami.is https://api.openai.com https://api.replicate.com https://api.stripe.com ${isDev ? "ws: wss:" : ""}`.trim(),
    // Fuentes locales y data URIs
    "font-src 'self' data:",
    // Evitar incrustaciones no deseadas
    "frame-ancestors 'none'",
    // Media locales y blobs
    "media-src 'self' blob:",
    // Workers y blobs
    "worker-src 'self' blob:",
    // Formularios solo a self y Stripe
    "form-action 'self' https://checkout.stripe.com"
  ].join("; ");
  res.headers.set("Content-Security-Policy", csp);
  
  // COEP/COOP/CORP deshabilitados por ahora - pueden bloquear recursos externos
  // Activar sólo cuando todos los recursos estén correctamente configurados con CORS
  // if (!isDev) {
  //   res.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  //   res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  //   res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  // }
  return res;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Admin protection (pages and API)
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/admin')) {
    const secret = request.headers.get('x-admin-secret') ?? request.cookies.get('admin_secret')?.value;
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    // Continue to route handler or page
    return NextResponse.next();
  }
  
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
  // Apply to localized pages plus explicitly to admin routes (API + pages)
  matcher: [
    "/api/admin/:path*",
    "/admin/:path*",
    "/((?!api|_next|static|health|.*\\..*).*)",
  ],
};
