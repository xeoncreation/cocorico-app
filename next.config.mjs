import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

// Hook up next-intl - usar el archivo de la raíz que hace re-export
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Configure PWA
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [],
  buildExcludes: [/middleware-manifest\.json$/],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  reactStrictMode: true,
  async headers() {
    const base = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      // HSTS meaningful on HTTPS; harmless otherwise
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    ];
    // COEP/COOP/CORP disabled - blocking external resources in Vercel
    // const prodOnly = [
    //   { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
    //   { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    //   { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    // ];
    // const headers = process.env.NODE_ENV === 'production' ? [...base, ...prodOnly] : base;
    const headers = base;
    return [
      {
        // Apply broadly; Next may still override for internal assets
        source: '/:path*',
        headers,
      },
    ];
  },
};

export default withPWA(withNextIntl(nextConfig));
