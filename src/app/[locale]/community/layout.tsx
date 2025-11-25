import { ReactNode } from "react";
import Wallpaper from "@/components/layout/Wallpaper";
import CommunityTabs from "@/components/community/CommunityTabs";

export default function CommunityLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <>
      <Wallpaper
        imageLight="/branding/COMUNIDAD_MODO_CLARO.jpg"
        imageDark="/branding/COMUNIDAD_MODO_OSCURO.jpg"
      />
      
      <div className="min-h-screen">
        <CommunityTabs locale={params.locale} />
        
        <div className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </>
  );
}
