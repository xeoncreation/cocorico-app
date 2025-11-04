import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/learn',
          '/r/*',
          '/recipes/search',
          '/legal/privacy',
          '/legal/terms',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/recipes/new',
          '/recipes/*/edit',
          '/chat',
          '/api/*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
