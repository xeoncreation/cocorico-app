import { Metadata } from "next";
import VoiceChatClient from "./voice-chat-client";
import dynamic from "next/dynamic";

const VoiceChatOnboarding = dynamic(
  () => import("@/components/voice-chat/VoiceChatOnboarding"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Chat de Voz IA | Cocorico",
  description: "Habla con Cocorico usando IA de voz avanzada. Conversación natural con reconocimiento de voz y respuestas en tiempo real.",
};

import Wallpaper from "@/components/layout/Wallpaper";

export default function VoiceChatPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <>
      <Wallpaper
        imageLight="/branding/HOME-INICIO,  Fondo Campo de Trigo, modo claro.png"
        imageDark="/branding/HOME - INICIO — Campo de trigo nocturno cálido (dark mode).png"
      />
      <VoiceChatOnboarding />
      <VoiceChatClient locale={locale} />
    </>
  );
}
