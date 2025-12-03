import { Metadata } from "next";
import Wallpaper from "@/components/layout/Wallpaper";
import NewPostClient from "./newpost-client";

export const metadata: Metadata = {
  title: "Crear Publicación | Cocorico",
  description: "Comparte tus recetas y experiencias culinarias con la comunidad.",
};

export default function NewPostPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/COMUNIDAD_MODO_CLARO.png"
        imageDark="/branding/COMUNIDAD_MODO_OSCURO.png"
      />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <NewPostClient />
      </main>
    </>
  );
}
