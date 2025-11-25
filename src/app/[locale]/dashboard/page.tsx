import DashboardClient from "@/components/dashboard/DashboardClient";
import { AppBackground } from "@/components/layout/AppBackground";
import Wallpaper from "@/components/layout/Wallpaper";

export default function DashboardPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS_RECETAS_MODO_CLARO.jpg"
        imageDark="/branding/MIS_RECETAS_MODO_OSCURO.jpg"
      />
      <AppBackground variantOverride="dashboard">
        <DashboardClient />
      </AppBackground>
    </>
  );
}
