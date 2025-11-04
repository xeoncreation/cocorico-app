import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Si hay contraseña de sitio configurada, bloquear todo
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
  
  // Configuración normal cuando el sitio es público
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
