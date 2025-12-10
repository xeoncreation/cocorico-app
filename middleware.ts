import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';

// BLOQUE 5: Middleware de i18n con English temporalmente deshabilitado
// Solo Español está completamente disponible, English redirige a ES
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

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl;
  const premiumParam = url.searchParams.get('premium');
  const themeParam = url.searchParams.get('theme');

  // ============================================
  // PROTECCIÓN DE RUTAS PRIVADAS
  // ============================================
  const protectedPaths = [
    '/dashboard',
    '/mis-recetas',
    '/favoritos',
    '/chat-unificado',
    '/settings',
    '/profile'
  ];

  const isProtectedRoute = protectedPaths.some(path => 
    pathname.includes(path) || pathname.endsWith(path)
  );

  if (isProtectedRoute) {
    // Verificar sesión de Supabase
    let supabaseResponse = NextResponse.next({ request });

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              request.cookies.set({ name, value, ...options });
              supabaseResponse = NextResponse.next({ request });
              supabaseResponse.cookies.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              request.cookies.set({ name, value: '', ...options });
              supabaseResponse = NextResponse.next({ request });
              supabaseResponse.cookies.set({ name, value: '', ...options });
            },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Redirigir a login con returnUrl
        const locale = pathname.startsWith('/es') ? 'es' : pathname.startsWith('/en') ? 'en' : 'es';
        const loginUrl = new URL(`/${locale}/login`, request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // BLOQUE 5: Redirigir /en a /es hasta que English esté completamente traducido
  if (pathname.startsWith('/en')) {
    const newPath = pathname.replace(/^\/en/, '/es');
    const redirectUrl = new URL(newPath, request.url);
    // Preservar query params
    url.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    const res = NextResponse.redirect(redirectUrl);
    return withSecurityHeaders(res);
  }

  // Theme toggle via query (?premium=1 | ?premium=0) or (?theme=premium|free)
  if (premiumParam === '1' || themeParam === 'premium') {
    const redirectUrl = new URL(url);
    redirectUrl.searchParams.delete('premium');
    redirectUrl.searchParams.delete('theme');
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set('theme', 'premium', { httpOnly: false, sameSite: 'lax', path: '/' });
    return withSecurityHeaders(res);
  }
  if (premiumParam === '0' || themeParam === 'free') {
    const redirectUrl = new URL(url);
    redirectUrl.searchParams.delete('premium');
    redirectUrl.searchParams.delete('theme');
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set('theme', 'free', { httpOnly: false, sameSite: 'lax', path: '/' });
    return withSecurityHeaders(res);
  }
  
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
    '/dev',           // Todas las rutas de desarrollo
    '/api/dev',       // APIs de desarrollo
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
