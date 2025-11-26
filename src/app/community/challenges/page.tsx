import Wallpaper from "@/components/layout/Wallpaper";
import GlassCard from "@/components/ui/GlassCard";

export default function CommunityChallengesPage() {
  // Aquí se debe integrar el listado de retos (adaptar lógica existente si hay)
  return (
    <>
      <Wallpaper
        imageLight="/branding/RETOS_MODO_CLARO.png"
        imageDark="/branding/RETOS_MODO_OSCURO.png"
      />
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <h1 className="text-3xl font-bold mb-6">Retos Cocorico</h1>
        {/* Aquí va el listado de retos, cada uno en un GlassCard */}
        <GlassCard>
          <div className="text-center py-8 text-neutral-500">
            Aquí aparecerán los retos activos y tu progreso.
          </div>
        </GlassCard>
      </div>
    </>
  );
}
