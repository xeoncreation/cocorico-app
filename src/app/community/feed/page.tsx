import Wallpaper from "@/components/layout/Wallpaper";
import GlassCard from "@/components/ui/GlassCard";

export default function CommunityFeedPage() {
  // Aquí se debe integrar el listado de recetas públicas (adaptar lógica existente si hay)
  return (
    <>
      <Wallpaper
        imageLight="/branding/FEED_MODO_CLARO.jpg"
        imageDark="/branding/FEED_MODO_OSCURO.jpg"
      />
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-3xl font-bold mb-6">Feed de Recetas Compartidas</h1>
        {/* Aquí va el listado de recetas públicas, cada una en un GlassCard */}
        <GlassCard>
          <div className="text-center py-8 text-neutral-500">
            Aquí aparecerán las recetas públicas compartidas por la comunidad.
          </div>
        </GlassCard>
      </div>
    </>
  );
}
