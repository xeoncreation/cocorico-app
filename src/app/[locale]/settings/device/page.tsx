"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Moon, Sun, Bell, BellOff, Smartphone, Monitor, Globe } from "lucide-react";

export default function DeviceSettingsPage() {
  const t = useTranslations();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );

    // Load saved preferences
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" || "system";
    setTheme(savedTheme);

    const savedOffline = localStorage.getItem("offlineMode") === "true";
    setOfflineMode(savedOffline);

    // Listen for PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Apply theme
    const root = document.documentElement;
    if (newTheme === "dark" || (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const handleNotificationToggle = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador no soporta notificaciones');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationsEnabled(false);
      // Note: Can't actually revoke permission from JS, user must do it in browser settings
      alert('Para desactivar notificaciones completamente, ve a la configuración de tu navegador');
    } else {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        new Notification('¡Notificaciones activadas! 🐓', {
          body: 'Recibirás alertas de tus retos diarios y nuevas recetas',
          icon: '/icons/icon-192.png',
        });
      }
    }
  };

  const handleOfflineToggle = () => {
    const newOfflineMode = !offlineMode;
    setOfflineMode(newOfflineMode);
    localStorage.setItem("offlineMode", String(newOfflineMode));
    
    if (newOfflineMode && 'serviceWorker' in navigator) {
      // Force cache update
      navigator.serviceWorker.ready.then((registration) => {
        registration.update();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cocorico-yellow/10 via-white to-cocorico-orange/5 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-display text-cocorico-red dark:text-amber-400 mb-2">
          ⚙️ Configuración del dispositivo
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          Personaliza Cocorico para tu dispositivo
        </p>

        {/* Install PWA */}
        {!isStandalone && installPrompt && (
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 mb-6 shadow-md border-2 border-cocorico-yellow/30">
            <div className="flex items-start gap-4">
              <Smartphone className="text-cocorico-red dark:text-amber-400 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  Instalar Cocorico
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Instala Cocorico en tu dispositivo para acceso rápido y modo offline
                </p>
                <button
                  onClick={handleInstallPWA}
                  className="px-4 py-2 bg-cocorico-red dark:bg-amber-500 text-white rounded-lg font-semibold hover:bg-cocorico-orange dark:hover:bg-amber-600 transition"
                >
                  Instalar ahora
                </button>
              </div>
            </div>
          </div>
        )}

        {isStandalone && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
            <p className="text-green-700 dark:text-green-300 font-medium">
              ✅ Cocorico está instalado como aplicación
            </p>
          </div>
        )}

        {/* Theme selector */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 mb-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            {theme === "dark" ? <Moon size={24} className="text-cocorico-red dark:text-amber-400" /> : <Sun size={24} className="text-cocorico-red dark:text-amber-400" />}
            <h3 className="font-semibold text-lg dark:text-white">Tema visual</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={`px-4 py-3 rounded-lg font-medium transition ${
                  theme === t
                    ? "bg-cocorico-red dark:bg-amber-500 text-white"
                    : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                }`}
              >
                {t === "light" && "☀️ Claro"}
                {t === "dark" && "🌙 Oscuro"}
                {t === "system" && "💻 Auto"}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 mb-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notificationsEnabled ? <Bell size={24} className="text-cocorico-red dark:text-amber-400" /> : <BellOff size={24} className="text-neutral-400" />}
              <div>
                <h3 className="font-semibold dark:text-white">Notificaciones push</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Recibe alertas de retos y nuevas recetas
                </p>
              </div>
            </div>
            <button
              onClick={handleNotificationToggle}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                notificationsEnabled
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              }`}
            >
              {notificationsEnabled ? "Activado" : "Activar"}
            </button>
          </div>
        </div>

        {/* Offline mode */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 mb-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={24} className="text-cocorico-red dark:text-amber-400" />
              <div>
                <h3 className="font-semibold dark:text-white">Modo offline mejorado</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Guarda más contenido para acceso sin conexión
                </p>
              </div>
            </div>
            <button
              onClick={handleOfflineToggle}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                offlineMode
                  ? "bg-cocorico-red dark:bg-amber-500 text-white"
                  : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              }`}
            >
              {offlineMode ? "Activado" : "Desactivado"}
            </button>
          </div>
        </div>

        {/* Device info */}
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Monitor size={24} className="text-neutral-600 dark:text-neutral-400" />
            <h3 className="font-semibold dark:text-white">Información del dispositivo</h3>
          </div>
          <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex justify-between">
              <span>Navegador:</span>
              <span className="font-mono">{navigator.userAgent.split(' ').slice(-2).join(' ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Plataforma:</span>
              <span className="font-mono">{navigator.platform}</span>
            </div>
            <div className="flex justify-between">
              <span>Modo PWA:</span>
              <span className={isStandalone ? "text-green-600 dark:text-green-400 font-semibold" : ""}>
                {isStandalone ? "✅ Sí" : "❌ No"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Worker:</span>
              <span className={'serviceWorker' in navigator ? "text-green-600 dark:text-green-400 font-semibold" : ""}>
                {'serviceWorker' in navigator ? "✅ Disponible" : "❌ No disponible"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
