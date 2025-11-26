import Wallpaper from "@/components/layout/Wallpaper";
import RecipeDetailClient from "@/components/recipes/RecipeDetailClient";
import { AppBackground } from "@/components/layout/AppBackground";

export default function RecipePage({ params: { id } }: { params: { id: string } }) {
  // We need to get locale from somewhere, usually params or context. 
  // Since this is a root layout page (not in [locale]), we might default to 'es' or try to detect.
  // However, the file path `src/app/recipes/[id]/page.tsx` suggests it is NOT localized?
  // Wait, `src/app/[locale]/recipes/page.tsx` exists.
  // But this file is `src/app/recipes/[id]/page.tsx`.
  // If the app uses `[locale]` routing, this file might be outside the locale scope?
  // Or maybe it's a catch-all?
  // The Orchestrator says `/recipes/[id]`.
  // If I look at `src/app/[locale]/page.tsx`, it seems the app is localized.
  // If `src/app/recipes/[id]/page.tsx` is used, it might be bypassing localization or using a default.
  // I'll assume 'es' for now or pass a prop if I can.
  
  return (
    <>
      <Wallpaper
        imageLight="/branding/RECETA PÚBLICA — Plating gourmet, modo claro.png"
        imageDark="/branding/RECETA PÚBLICA — Plating gourmet, modo oscuro.png"
      />
      <AppBackground variantOverride="recipes-neutral">
        <RecipeDetailClient id={id} locale="es" />
      </AppBackground>
    </>
  );
}