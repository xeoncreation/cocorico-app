export const dynamic = 'force-dynamic';
import RecipesClient from '@/components/recipes/RecipesClient';
import Wallpaper from "@/components/layout/Wallpaper";
import { AppBackground } from '@/components/layout/AppBackground';
import LegacyPageWrapper from '@/components/layout/LegacyPageWrapper';

export default function RecipesPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS_RECETAS_MODO_CLARO.jpg"
        imageDark="/branding/MIS_RECETAS_MODO_OSCURO.jpg"
      />
      <LegacyPageWrapper>
        <AppBackground variantOverride="recipes-neutral">
          <RecipesClient />
        </AppBackground>
      </LegacyPageWrapper>
    </>
  );
}