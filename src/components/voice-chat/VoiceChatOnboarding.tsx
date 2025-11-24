"use client";

import { useState, useEffect } from "react";
import { X, Mic, Volume2, MessageSquare } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { RippleButton } from "@/components/ui/ripple-button";

export default function VoiceChatOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem("voice-chat-onboarding-seen");
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("voice-chat-onboarding-seen", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 duration-300 coco-glass">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cocorico-turquoise to-cocorico-avocado mb-4">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Chat de Voz con IA
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Habla con Cocorico como si fuera ChatGPT
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full coco-glass flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 text-cocorico-mango" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                1. Presiona el micrófono
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Haz clic en el botón del micrófono para empezar a hablar. Se te pedirán permisos la primera vez.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full coco-glass flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-cocorico-turquoise" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                2. Habla naturalmente
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Pregunta sobre recetas, ingredientes, cocina o lo que necesites.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-10 h-10 rounded-full coco-glass flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-5 h-5 text-cocorico-avocado" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                3. Escucha la respuesta
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Cocorico te responderá con voz natural. Puedes ver el texto en pantalla también.
              </p>
            </div>
          </div>
        </div>

        <div className="coco-glass rounded-lg p-3 mb-6">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            💡 <strong>Tip:</strong> Intenta preguntas como "¿Cómo preparo un arroz con pollo?" o "Dame recetas con aguacate"
          </p>
        </div>

        <RippleButton
          onClick={handleClose}
          className="w-full coco-btn-primary"
        >
          ¡Entendido, empezar!
        </RippleButton>
      </div>
    </div>
  );
}
