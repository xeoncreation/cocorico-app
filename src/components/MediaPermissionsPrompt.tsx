"use client";

import { useState, useEffect } from 'react';
import { useMediaPermissions } from '@/hooks/useMediaPermissions';
import { Button } from '@/components/ui/button';
import { Camera, Mic, X } from 'lucide-react';

export default function MediaPermissionsPrompt() {
  const [show, setShow] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const { permissions, requestBothPermissions } = useMediaPermissions();

  useEffect(() => {
    // Check if we've already asked
    const asked = localStorage.getItem('media-permissions-asked');
    if (asked) {
      setHasAsked(true);
      return;
    }

    // Show prompt after 3 seconds if permissions are not granted
    const timer = setTimeout(() => {
      if (permissions.camera !== 'granted' || permissions.microphone !== 'granted') {
        setShow(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [permissions]);

  const handleRequest = async () => {
    const result = await requestBothPermissions();
    localStorage.setItem('media-permissions-asked', 'true');
    setHasAsked(true);
    setShow(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('media-permissions-asked', 'true');
    setHasAsked(true);
    setShow(false);
  };

  if (!show || hasAsked) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="coco-glass rounded-2xl p-6 max-w-md w-full space-y-4 relative animate-in zoom-in-95 duration-300">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="flex justify-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cocorico-red to-orange-500 flex items-center justify-center shadow-lg">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Mic className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="heading-2 text-xl font-bold glass-text-strong">
            🐓 Cocorico necesita permisos
          </h2>
          
          <p className="body-regular glass-text-medium">
            Para usar el <strong>escáner de productos</strong> y el <strong>chat de voz</strong>, 
            necesitamos acceso a tu cámara y micrófono.
          </p>

          <div className="text-sm glass-text-medium space-y-1">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>Cámara: Escanear códigos de barras y productos</span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span>Micrófono: Chatear con Cocorico por voz</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="flex-1"
          >
            Ahora no
          </Button>
          <Button
            onClick={handleRequest}
            className="flex-1 bg-gradient-to-r from-cocorico-red to-orange-500 hover:from-cocorico-red/90 hover:to-orange-500/90 text-white font-bold"
          >
            Permitir acceso
          </Button>
        </div>

        <p className="text-xs text-center glass-text-medium opacity-70">
          Puedes cambiar estos permisos en cualquier momento desde la configuración de tu navegador
        </p>
      </div>
    </div>
  );
}
