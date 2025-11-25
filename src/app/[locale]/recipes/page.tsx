import RecipesClient from '@/components/recipes/RecipesClient';
import { AppBackground } from '@/components/layout/AppBackground';
import Wallpaper from '@/components/layout/Wallpaper';

export const dynamic = 'force-dynamic';

export default function RecipesPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/SEARCH - BÚSQUEDA — Especias y hierbas, modo claro.png"
        imageDark="/branding/SEARCH - BÚSQUEDA — Especias en mesa, modo oscuro.png"
      />
      <AppBackground variantOverride="recipes-neutral">
        <RecipesClient />
      </AppBackground>
    </>
  );
}
