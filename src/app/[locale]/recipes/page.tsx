import RecipesClient from '@/components/recipes/RecipesClient';
import { AppBackground } from '@/components/layout/AppBackground';
import Wallpaper from '@/components/layout/Wallpaper';

export const dynamic = 'force-dynamic';

export default function RecipesPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS RECETAS- DASHBOARD — Cocina cenital difusa, modo claro.png"
        imageDark="/branding/MIS RECETAS - DASHBOARD — Encimera oscura gourmet, modo oscuro.png"
      />
      <AppBackground variantOverride="recipes-neutral">
        <RecipesClient />
      </AppBackground>
    </>
  );
}
