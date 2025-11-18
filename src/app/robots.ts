import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocorico.app';
  
  // Block indexing if site password is set
  const isProtected = !!process.env.SITE_PASSWORD;
  
  if (isProtected) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }
  
  // Normal configuration for public site
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/es/', '/en/', '/learn', '/community', '/recipes', '/search', '/pricing', '/legal/*'],
        disallow: ['/admin', '/admin/', '/api', '/api/', '/dev-test', '/dev-test/', '/dashboard/', '/settings/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

