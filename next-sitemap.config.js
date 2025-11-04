/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://cocorico.app',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.8,
  sitemapSize: 5000,
  outDir: './public',
  exclude: [
    '/admin/*',
    '/api/*',
    '/dashboard/*',
    '/test',
    '/auth/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/dashboard', '/auth'],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cocorico.app'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Personalizar prioridades según ruta
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/recipes') || path.includes('/chat')) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path.includes('/learn')) {
      priority = 0.7;
      changefreq = 'weekly';
    } else if (path.includes('/legal')) {
      priority = 0.3;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
