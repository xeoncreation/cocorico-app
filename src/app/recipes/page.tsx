export const dynamic = 'force-dynamic';
import RecipesClient from '@/components/recipes/RecipesClient';
import Wallpaper from "@/components/layout/Wallpaper";
import { AppBackground } from '@/components/layout/AppBackground';
import LegacyPageWrapper from '@/components/layout/LegacyPageWrapper';

export default function RecipesPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS RECETAS- DASHBOARD — Cocina cenital difusa, modo claro.png"
        imageDark="/branding/MIS RECETAS - DASHBOARD — Encimera oscura gourmet, modo oscuro.png"
      />
      <LegacyPageWrapper>
        <AppBackground variantOverride="recipes-neutral">
          <RecipesClient />
        </AppBackground>
      </LegacyPageWrapper>
    </>
  );
}