/**
 * Envía notificación push usando Firebase Cloud Messaging
 * NOTA: Esto debe ejecutarse desde el servidor (API route o Edge Function)
 */
export async function sendPushNotification(
  token: string, 
  title: string, 
  body: string,
  data?: Record<string, string>
) {
  const serverKey = process.env.FIREBASE_SERVER_KEY;
  
  if (!serverKey) {
    console.error("❌ FIREBASE_SERVER_KEY no configurada");
    return { success: false, error: "Missing server key" };
  }

  try {
    const res = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: `key=${serverKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token,
        notification: { 
          title, 
          body, 
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-72.png",
          tag: "cocorico-notification",
          requireInteraction: false,
        },
        data: data || {},
      }),
    });

    const result = await res.json();
    
    if (result.success === 1) {
      console.log("✅ Notificación enviada exitosamente");
      return { success: true, result };
    } else {
      console.error("❌ Error enviando notificación:", result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.error("❌ Error en sendPushNotification:", error);
    return { success: false, error };
  }
}

/**
 * Tipos de notificaciones automáticas
 */
export enum NotificationType {
  LEVEL_UP = "level_up",
  BADGE_EARNED = "badge_earned",
  RECIPE_LIKED = "recipe_liked",
  DAILY_REMINDER = "daily_reminder",
  INGREDIENT_REMINDER = "ingredient_reminder",
}

/**
 * Envía notificación basada en evento del sistema
 */
export async function sendEventNotification(
  userId: string,
  type: NotificationType,
  data: Record<string, any>
) {
  // Aquí deberías obtener el push_token del usuario desde Supabase
  // Por ahora solo registramos el evento
  console.log(`📬 Notificación ${type} para usuario ${userId}:`, data);
  
  // TODO: Implementar en API route con:
  // 1. Obtener push_token del usuario
  // 2. Construir mensaje según tipo
  // 3. Llamar sendPushNotification()
}
