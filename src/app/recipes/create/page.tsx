'use client';

import RecipeForm from '@/components/RecipeForm';
import Wallpaper from "@/components/layout/Wallpaper";

export default function NewRecipePage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/CREAR RECETA — Ingredientes frescos, modo claro.png"
        imageDark="/branding/CREAR RECETA — Ingredientes con luz cinematográfica, modo oscuro.png"
      />
      <RecipeForm />
    </>
  );
}