import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Páginas estáticas
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/recipes/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // TODO: Aquí puedes añadir recetas públicas dinámicamente
  // consultando Supabase si quieres indexar /r/[user]/[slug]
  // Ejemplo:
  // const { data: publicRecipes } = await supabase
  //   .from('recipes')
  //   .select('user_id, slug, updated_at')
  //   .eq('visibility', 'public');
  //
  // const recipePages = publicRecipes?.map(r => ({
  //   url: `${baseUrl}/r/${r.user_id}/${r.slug}`,
  //   lastModified: new Date(r.updated_at),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // })) || [];

  return staticPages;
}
