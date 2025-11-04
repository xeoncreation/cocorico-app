// Configuración Firebase para Web Push
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase solo en cliente y solo una vez
let messaging: Messaging | null = null;

if (typeof window !== "undefined" && !getApps().length) {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export async function requestPermission() {
  if (typeof window === "undefined" || !messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, { 
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY 
      });
      console.log("✅ Token FCM obtenido:", token.substring(0, 20) + "...");
      return token;
    } else {
      console.log("❌ Permiso de notificaciones denegado");
      return null;
    }
  } catch (err) {
    console.error("Error al obtener permiso de notificaciones:", err);
    return null;
  }
}

export function onMessageListener() {
  if (!messaging) return Promise.resolve();
  
  return new Promise((resolve) => {
    onMessage(messaging!, (payload) => {
      console.log("📬 Mensaje recibido:", payload);
      resolve(payload);
    });
  });
}

export { messaging };
