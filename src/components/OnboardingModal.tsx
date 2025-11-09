'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChefHat, Camera, Trophy } from 'lucide-react';
import { trackEvent } from '@/components/UmamiAnalytics';

interface OnboardingModalProps {
  onComplete?: () => void;
}

export default function OnboardingModal({ onComplete = () => {} }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya completó el onboarding
    const completed = localStorage.getItem('onboarding_completed');
    if (!completed) {
      setShow(true);
      trackEvent.onboardingStarted();
    }
  }, []);

  const steps = [
    {
      icon: ChefHat,
      title: '¡Bienvenido a Cocorico! 🎉',
      description: 'Tu asistente de cocina con inteligencia artificial está listo para ayudarte.',
      action: 'Comenzar',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: ChefHat,
      title: '1. Crea tu primera receta',
      description: 'Escribe ingredientes que tienes en casa y la IA te sugerirá recetas deliciosas.',
      action: 'Ir a crear receta',
      link: '/recipes/new',
      color: 'from-blue-500 to-purple-500',
    },
    {
      icon: Camera,
      title: '2. Prueba el escáner de ingredientes',
      description: 'Toma una foto de tus ingredientes y descubre qué puedes cocinar con ellos.',
      action: 'Probar escáner',
      link: '/dashboard/lab',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: Trophy,
      title: '3. Completa un reto diario',
      description: 'Cada día hay un nuevo reto de cocina. ¡Complétalo y gana XP y badges!',
      action: 'Ver retos',
      link: '/dashboard/challenges',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      trackEvent.onboardingStepCompleted(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    trackEvent.onboardingCompleted();
    setShow(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Header con gradiente */}
          <div className={`bg-gradient-to-r ${currentStep.color} p-8 text-white relative`}>
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <Icon size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
              <p className="text-white/90">{currentStep.description}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Progress indicator */}
            <div className="flex gap-2 mb-6 justify-center">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === step
                      ? 'w-8 bg-[#e43f30]'
                      : i < step
                      ? 'w-2 bg-[#e43f30]/50'
                      : 'w-2 bg-gray-300 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Atrás
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-[#e43f30] hover:bg-[#c43525] text-white rounded-lg transition-colors font-medium"
              >
                {step === steps.length - 1 ? '¡Empezar!' : currentStep.action}
              </button>
            </div>

            {step === 0 && (
              <button
                onClick={handleSkip}
                className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Saltar tutorial
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
