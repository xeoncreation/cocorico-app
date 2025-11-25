import DashboardClient from "@/components/dashboard/DashboardClient";
import { AppBackground } from "@/components/layout/AppBackground";
import Wallpaper from "@/components/layout/Wallpaper";

export default function DashboardPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS RECETAS- DASHBOARD — Cocina cenital difusa, modo claro.png"
        imageDark="/branding/MIS RECETAS - DASHBOARD — Encimera oscura gourmet, modo oscuro.png"
      />
      <AppBackground variantOverride="dashboard">
        <DashboardClient />
      </AppBackground>
    </>
  );
}
