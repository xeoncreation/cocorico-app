import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cocorico.app';
  const locales = ['es', 'en'];
  const currentDate = new Date();

  const staticPages = [
    { path: '', priority: 1.0, freq: 'daily' as const },
    { path: '/chat', priority: 0.9, freq: 'daily' as const },
    { path: '/dashboard', priority: 0.8, freq: 'weekly' as const },
    { path: '/learn', priority: 0.9, freq: 'weekly' as const },
    { path: '/community', priority: 0.8, freq: 'daily' as const },
    { path: '/recipes', priority: 0.9, freq: 'daily' as const },
    { path: '/search', priority: 0.8, freq: 'daily' as const },
    { path: '/pricing', priority: 0.7, freq: 'monthly' as const },
    { path: '/legal/terms', priority: 0.3, freq: 'monthly' as const },
    { path: '/legal/privacy', priority: 0.3, freq: 'monthly' as const },
    { path: '/legal/cookies', priority: 0.3, freq: 'monthly' as const },
    { path: '/legal/refunds', priority: 0.3, freq: 'monthly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate locale-aware URLs (exclude /admin, /dev-test, /api)
  locales.forEach((locale) => {
    staticPages.forEach(({ path, priority, freq }) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: currentDate,
        changeFrequency: freq,
        priority,
      });
    });
  });

  // Future: add dynamic recipe pages from Supabase
  // const { data: publicRecipes } = await supabase
  //   .from('recipes')
  //   .select('user_id, slug, updated_at')
  //   .eq('visibility', 'public');
  // publicRecipes?.forEach(r => sitemapEntries.push({...}));

  return sitemapEntries;
}

