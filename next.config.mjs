import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

// Feature flags via env to aid troubleshooting without renaming config files
const DISABLE_PWA = String(process.env.DISABLE_PWA || '').toLowerCase();
const DISABLE_INTL = String(process.env.DISABLE_INTL || '').toLowerCase();
const MINIMAL_NEXT_CONFIG = String(process.env.MINIMAL_NEXT_CONFIG || '').toLowerCase();
const isTrue = (v) => v === '1' || v === 'true' || v === 'yes';

const disablePWA = isTrue(DISABLE_PWA);
const disableIntl = isTrue(DISABLE_INTL);
const minimal = isTrue(MINIMAL_NEXT_CONFIG);

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

// Compose plugins conditionally based on flags
let finalConfig = nextConfig;

if (!minimal) {
  if (!disableIntl) {
    const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
    finalConfig = withNextIntl(finalConfig);
  }
  if (!disablePWA) {
    const withPWA = withPWAInit({
      dest: 'public',
      disable: process.env.NODE_ENV === 'development',
      register: true,
      skipWaiting: true,
      runtimeCaching: [],
      buildExcludes: [/middleware-manifest\.json$/],
    });
    finalConfig = withPWA(finalConfig);
  }
}

export default finalConfig;
