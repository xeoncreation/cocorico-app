"use client";
import { useEffect, useState } from "react";
import { requestPermission } from "@/firebase";
import { savePushToken } from "@/utils/push";
import { Bell, BellOff, X } from "lucide-react";

export default function PushNotificationPrompt() {
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Verificar permiso actual
    const currentPermission = Notification.permission;
    setPermission(currentPermission);

    // Mostrar prompt solo si no se ha decidido y hay usuario logueado
    const hasDecided = localStorage.getItem("push_notification_decided");
    if (currentPermission === "default" && !hasDecided) {
      // Esperar 5 segundos antes de mostrar el prompt
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  async function handleAccept() {
    const token = await requestPermission();
    if (token) {
      await savePushToken(token);
      setPermission("granted");
    } else {
      setPermission("denied");
    }
    localStorage.setItem("push_notification_decided", "true");
    setShow(false);
  }

  function handleDismiss() {
    localStorage.setItem("push_notification_decided", "true");
    setShow(false);
  }

  if (!show || permission !== "default") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-2xl border-2 border-cocorico-yellow dark:border-amber-500 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cocorico-yellow/20 dark:bg-amber-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-cocorico-red dark:text-amber-400" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1">
              ¿Activar notificaciones? 🐓
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
              Recibe recordatorios de cocina, nuevos likes y cuando subas de nivel
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 px-3 py-2 bg-cocorico-red dark:bg-amber-500 text-white rounded-md text-xs font-semibold hover:bg-cocorico-orange dark:hover:bg-amber-600 transition"
              >
                Activar
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-600 transition"
              >
                Ahora no
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            aria-label="Cerrar aviso de notificaciones"
            title="Cerrar"
            className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
