import { redirect } from "next/navigation";

/**
 * Voice Chat - DEPRECATED
 * 
 * El chat de voz ahora está integrado en la página principal de chat.
 * Redirigiendo automáticamente...
 */
export default function VoiceChatRedirectPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect(`/${locale}/chat`);
}
