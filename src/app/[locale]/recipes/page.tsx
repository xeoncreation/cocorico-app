import RecipesClient from '@/components/recipes/RecipesClient';
import { AppBackground } from '@/components/layout/AppBackground';
import Wallpaper from '@/components/layout/Wallpaper';

export const dynamic = 'force-dynamic';

export default function RecipesPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS_RECETAS_MODO_CLARO.jpg"
        imageDark="/branding/MIS_RECETAS_MODO_OSCURO.jpg"
      />
      <AppBackground variantOverride="recipes-neutral">
        <RecipesClient />
      </AppBackground>
    </>
  );
}
