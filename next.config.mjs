import createNextIntlPlugin from 'next-intl/plugin';

// Hook up next-intl so server APIs like getMessages/getTranslations can find the i18n request config.
// See: https://next-intl.dev/docs/usage/configuration#nextjs-plugin
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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
    const prodOnly = [
      { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    ];
    const headers = process.env.NODE_ENV === 'production' ? [...base, ...prodOnly] : base;
    return [
      {
        // Apply broadly; Next may still override for internal assets
        source: '/:path*',
        headers,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
