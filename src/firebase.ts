/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Configuración Firebase para Web Push (OPCIONAL)
// Firebase NO está instalado por defecto. Para habilitarlo:
// 1. npm install firebase
// 2. Configurar variables NEXT_PUBLIC_FIREBASE_* en .env.local

type Messaging = any;

let initializeApp: any = null;
let getApps: any = null;
let getMessaging: any = null;
let getToken: any = null;
let onMessage: any = null;
let firebaseAvailable = false;

// Intentar cargar Firebase de forma dinámica (solo si está instalado)
if (typeof window !== "undefined") {
  try {
    // @ts-ignore - Firebase es opcional y puede no estar instalado
    const firebaseApp = require("firebase/app");
    // @ts-ignore - Firebase es opcional y puede no estar instalado
    const firebaseMessaging = require("firebase/messaging");
    
    initializeApp = firebaseApp.initializeApp;
    getApps = firebaseApp.getApps;
    getMessaging = firebaseMessaging.getMessaging;
    getToken = firebaseMessaging.getToken;
    onMessage = firebaseMessaging.onMessage;
    firebaseAvailable = true;
  } catch (error) {
    // Firebase no está instalado - esto es esperado y normal
    firebaseAvailable = false;
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase solo si está disponible
let messaging: Messaging | null = null;

if (firebaseAvailable && typeof window !== "undefined" && initializeApp && getApps) {
  try {
    if (!getApps().length) {
      const app = initializeApp(firebaseConfig);
      messaging = getMessaging?.(app) || null;
    }
  } catch (error) {
    console.warn("⚠️ Error al inicializar Firebase:", error);
    firebaseAvailable = false;
  }
}

export async function requestPermission() {
  if (!firebaseAvailable || typeof window === "undefined" || !messaging || !getToken) {
    console.info("ℹ️ Firebase no disponible - notificaciones push deshabilitadas");
    return null;
  }
  
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
  if (!firebaseAvailable || !messaging || !onMessage) {
    return Promise.resolve(null);
  }
  
  return new Promise((resolve) => {
    onMessage(messaging!, (payload: any) => {
      console.log("📬 Mensaje recibido:", payload);
      resolve(payload);
    });
  });
}

export { messaging, firebaseAvailable };
