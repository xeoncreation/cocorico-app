export const dynamic = 'force-dynamic';
import RecipesClient from '@/components/recipes/RecipesClient';
import Wallpaper from "@/components/layout/Wallpaper";
import { AppBackground } from '@/components/layout/AppBackground';
import LegacyPageWrapper from '@/components/layout/LegacyPageWrapper';

export default function RecipesPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/SEARCH - BÚSQUEDA — Especias y hierbas, modo claro.png"
        imageDark="/branding/SEARCH - BÚSQUEDA — Especias en mesa, modo oscuro.png"
      />
      <LegacyPageWrapper>
        <AppBackground variantOverride="recipes-neutral">
          <RecipesClient />
        </AppBackground>
      </LegacyPageWrapper>
    </>
  );
}