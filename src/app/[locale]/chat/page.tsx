import { Metadata } from "next";
import ChatUnified from "@/components/chat/ChatUnified";

export const metadata: Metadata = {
  title: "Asistente Culinario | IA de Cocina",
  description:
    "Conversa con nuestro asistente culinario inteligente. Obtén recetas personalizadas, consejos de cocina y respuestas instantáneas.",
};

export default function ChatPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return <ChatUnified locale={locale} />;
}
