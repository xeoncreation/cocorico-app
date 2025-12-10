/**
 * Componente de ejemplo para usar el sistema de gates en cualquier funcionalidad
 * 
 * Este es un template que puedes copiar y adaptar para otras funciones premium
 */

'use client';

import { useState, useEffect } from 'react';
import { usePremiumFeatureGate } from '@/hooks/usePremiumFeatureGate';
import type { FeatureKey } from '@/config/featureLimits';
import { Loader2 } from 'lucide-react';

interface PremiumActionButtonProps {
  featureKey: FeatureKey;
  onAllowed: () => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
}

/**
 * Botón genérico para cualquier acción premium
 * 
 * @example
 * <PremiumActionButton
 *   featureKey="nutrition_analysis"
 *   onAllowed={async () => {
 *     // Tu lógica aquí
 *     const result = await analyzeNutrition(food);
 *   }}
 * >
 *   Analizar nutrición
 * </PremiumActionButton>
 */
export function PremiumActionButton({
  featureKey,
  onAllowed,
  children,
  className = '',
  loadingText = 'Comprobando...',
}: PremiumActionButtonProps) {
  const { checking, checkAndRun } = usePremiumFeatureGate();

  const handleClick = () => {
    checkAndRun(featureKey, onAllowed);
  };

  return (
    <button
      onClick={handleClick}
      disabled={checking}
      className={`rounded-xl px-6 py-3 font-semibold transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {checking ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * HOC para envolver cualquier componente con protección premium
 * 
 * @example
 * const ProtectedChatInterface = withPremiumGate(
 *   ChatInterface,
 *   'ai_chat'
 * );
 */
export function withPremiumGate<P extends object>(
  Component: React.ComponentType<P>,
  featureKey: FeatureKey
) {
  return function PremiumGatedComponent(props: P) {
    const { checking, checkAndRun } = usePremiumFeatureGate();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
      checkAndRun(featureKey, async () => {
        setAllowed(true);
      });
    }, []);

    if (checking) {
      return (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      );
    }

    if (!allowed) {
      return null; // El modal se encargará de mostrar el mensaje
    }

    return <Component {...props} />;
  };
}
