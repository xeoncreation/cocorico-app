import { Metadata } from "next";
import Wallpaper from "@/components/layout/Wallpaper";
import CommunityChatClient from "./community-chat-client";

export const metadata: Metadata = {
  title: "Chat de la Comunidad | Cocorico",
  description: "Conecta con otros cocineros, comparte tips y recetas en tiempo real.",
};

export default function CommunityChatPage() {
  return (
    <>
      <Wallpaper
        imageLight="/branding/CHAT_MODO_CLARO.png"
        imageDark="/branding/CHAT_MODO_OSCURO.png"
      />
      <CommunityChatClient />
    </>
  );
}
