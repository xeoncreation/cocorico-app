'use client';

import RecipeForm from '@/components/RecipeForm';

import Wallpaper from "@/components/layout/Wallpaper";

export default function NewRecipePage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/CREAR_RECETA_MODO_CLARO.jpg"
        imageDark="/branding/CREAR_RECETA_MODO_OSCURO.jpg"
      />
      <RecipeForm />
    </>
  );
}