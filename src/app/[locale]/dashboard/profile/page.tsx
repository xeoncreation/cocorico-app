import ProfileClient from './profile-client';
import { AppBackground } from '@/components/layout/AppBackground';
import Wallpaper from "@/components/layout/Wallpaper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil | Cocorico",
  description: "Edita tu información personal, avatar y preferencias.",
};

  return (
    <>
      <Wallpaper
        imageLight="/branding/PERFIL_MODO_CLARO.jpg"
        imageDark="/branding/PERFIL_MODO_OSCURO.jpg"
      />
      <AppBackground variantOverride="profile">
        <main className="max-w-4xl mx-auto px-4 py-10">
          <ProfileClient />
        </main>
      </AppBackground>
    </>
  );
}
