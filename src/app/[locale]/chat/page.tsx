"use client";

import { useTranslations } from "next-intl";
import ChatBox from "@/components/ChatBox";
import CocoricoMascot, { useMascotMood } from "@/components/CocoricoMascot";
import Wallpaper from "@/components/layout/Wallpaper";
import { useEffect } from "react";

export default function ChatPage() {
  const t = useTranslations();
  const { mood, setMood } = useMascotMood("default");
  
  const plan =
    typeof document !== "undefined"
      ? (document.documentElement.dataset.theme as "free" | "premium")
      : "free";

  // Animación aleatoria de gestos cada 5-8 segundos
  useEffect(() => {
    const moods = ["happy", "thinking", "chef", "cooking", "default"] as const;
    let timeoutId: NodeJS.Timeout;
    
    const randomGesture = () => {
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setMood(randomMood, 3000);
      
      const nextDelay = 5000 + Math.random() * 3000; // 5-8 segundos
      timeoutId = setTimeout(randomGesture, nextDelay);
    };
    
    timeoutId = setTimeout(randomGesture, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [setMood]);

  return (
    <>
      <Wallpaper
        imageLight="/branding/CHAT_MODO_CLARO.png"
        imageDark="/branding/CHAT_MODO_OSCURO.png"
      />
      <section className="min-h-screen overflow-hidden">
      {/* Mascota flotante a la derecha - Solo visible en pantallas grandes */}
      <div className="hidden xl:block absolute top-4 right-12 z-10 pointer-events-none">
        <div className="glass-card-premium p-4 rounded-3xl">
          <CocoricoMascot mood={mood} size="lg" animated className="animate-float" />
        </div>
      </div>

      {/* Contenedor principal con liquid glass */}
      <div className={`flex flex-col min-h-screen ${plan === "premium" ? "glass-panel-premium" : ""}`}>
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 py-6 lg:py-8">
          {/* Header */}
          <div className="text-center mb-6 space-y-2">
            <h1 className={`text-3xl lg:text-4xl font-bold ${plan === "premium" ? "glass-text-premium" : "text-pink-900 dark:text-pink-300"}`}>
              {t("chat.title")} 🐓
            </h1>
            <p className={`text-sm lg:text-base ${plan === "premium" ? "text-white/80" : "text-muted-foreground"}`}>
              {t("chat.subtitle")}
            </p>
          </div>

          {/* ChatBox con liquid glass */}
          <div className={`flex-1 ${plan === "premium" ? "glass-card-premium" : "bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-2xl"} shadow-2xl overflow-hidden`}>
            <ChatBox />
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
