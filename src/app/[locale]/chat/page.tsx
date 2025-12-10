import { Metadata } from "next";
import ChatUnified from "@/components/chat/ChatUnified";

export const metadata: Metadata = {
  title: "Chat con Cocorico | IA de Cocina",
  description:
    "Chatea con Cocorico usando texto o voz. Obtén recetas personalizadas, consejos de cocina y respuestas instantáneas con IA avanzada.",
};

export default function ChatPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <ChatUnified locale={locale} />;
}
