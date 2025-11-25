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
        imageLight="/branding/HOME-INICIO,  Fondo Campo de Trigo, modo claro.png"
        imageDark="/branding/HOME - INICIO — Campo de trigo nocturno cálido (dark mode).png"
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
