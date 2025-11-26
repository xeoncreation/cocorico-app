import Wallpaper from "@/components/layout/Wallpaper";
import GlassCard from "@/components/ui/GlassCard";

export default function CommunityChatPage() {
  // Aquí se debe integrar el chat real (de momento placeholder)
  return (
    <>
      <Wallpaper
        imageLight="/branding/CHAT_MODO_CLARO.png"
        imageDark="/branding/CHAT_MODO_OSCURO.png"
      />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <GlassCard>
          <h1 className="text-2xl font-bold mb-4">Chat de la Comunidad</h1>
          <div className="min-h-[300px] flex flex-col justify-end">
            <div className="flex-1 text-neutral-500 py-8 text-center">
              Aquí aparecerán los mensajes del chat global.
            </div>
            <div className="border-t pt-4">
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Escribe un mensaje..."
                disabled
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
