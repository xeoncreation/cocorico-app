import Wallpaper from "@/components/layout/Wallpaper";
import GlassCard from "@/components/ui/GlassCard";

export default async function PremiumPage({ params }: { params: { locale: string } }) {
  return (
    <>
      <Wallpaper
        imageLight="/branding/PREMIUM_MODO_CLARO.jpg"
        imageDark="/branding/PREMIUM_MODO_OSCURO.jpg"
      />
      <div className="min-h-screen max-w-5xl mx-auto px-4 py-12">
        <GlassCard className="p-8 md:p-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cocorico Premium
          </h1>
          {/* Premium content: benefits, pricing, CTA, features, FAQ */}
        </GlassCard>
      </div>
    </>
  );
}
