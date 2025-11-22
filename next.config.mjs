import createNextIntlPlugin from 'next-intl/plugin';
import withPWAInit from 'next-pwa';

// Feature flags via env to aid troubleshooting without renaming config files
const DISABLE_PWA = String(process.env.DISABLE_PWA || '').toLowerCase();
const DISABLE_INTL = String(process.env.DISABLE_INTL || '').toLowerCase();
const MINIMAL_NEXT_CONFIG = String(process.env.MINIMAL_NEXT_CONFIG || '').toLowerCase();
const isTrue = (v) => v === '1' || v === 'true' || v === 'yes';

const disablePWA = true; // isTrue(DISABLE_PWA);
const disableIntl = isTrue(DISABLE_INTL);
const minimal = isTrue(MINIMAL_NEXT_CONFIG);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow isolating build output when running multiple dev servers concurrently
  // Use env var to avoid .next file locking conflicts on Windows
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Allow production builds to succeed even if there are ESLint errors.
  // We will track and fix lint issues separately.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  // On some Windows setups Next can fail to load vendor chunk names like "@supabase.js".
  // Force transpiling Supabase packages to avoid external vendor-chunk resolution issues.
  transpilePackages: [
    "@supabase/supabase-js",
    "@supabase/auth-helpers-nextjs",
    "@supabase/auth-helpers-react",
  ],
  reactStrictMode: true,
  async headers() {
    const base = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is https://va.vercel-scripts.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https://*.supabase.co https://via.placeholder.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.stripe.com https://api.elevenlabs.io https://api.replicate.com https://cloud.umami.is",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ')
      },
    ];
    
    return [
      {
        source: '/:path*',
        headers: base,
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
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'supabase-api-cache',
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 60 * 5, // 5 minutes
            },
            networkTimeoutSeconds: 10,
          },
        },
        {
          urlPattern: /\.(?:jpg|jpeg|png|webp|svg|gif|ico)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
        {
          urlPattern: /^https:\/\/cloud\.umami\.is\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'analytics-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60, // 1 hour
            },
          },
        },
      ],
      buildExcludes: [/middleware-manifest\.json$/],
    });
    finalConfig = withPWA(finalConfig);
  }
}

export default finalConfig;
