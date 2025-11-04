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
};

export default withNextIntl(nextConfig);
