import Wallpaper from "@/components/layout/Wallpaper";
import GlassCard from "@/components/ui/GlassCard";

export default function CommunityChatPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/CHAT_MODO_CLARO.png"
        imageDark="/branding/CHAT_MODO_OSCURO.png"
      />
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="max-w-2xl w-full p-8 rounded-3xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Chat de la Comunidad</h1>
          {/* Chat panel aquí */}
        </GlassCard>
      </div>
    </>
  );
}
