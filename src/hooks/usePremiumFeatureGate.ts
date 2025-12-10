/**
 * Hook: usePremiumFeatureGate
 * 
 * Este hook es la PUERTA DE ENTRADA para cualquier función premium de la app.
 * 
 * Flujo:
 * 1. Verifica si hay usuario logueado
 *    - NO → Muestra modal de login
 * 2. Llama al endpoint /api/feature-usage/use
 *    - Endpoint verifica plan (free/premium)
 *    - Si es free, verifica límites semanales
 * 3. Según respuesta:
 *    - allowed = true → Ejecuta la acción
 *    - allowed = false + limit_reached → Muestra modal de límite agotado
 *    - allowed = false + unauthorized → Muestra modal de login
 * 
 * @module usePremiumFeatureGate
 */

'use client';

import { useState } from 'react';
import { useAuthGateModal } from '@/contexts/AuthGateModalContext';
import { useUser } from '@/lib/auth/client';
import type { FeatureKey } from '@/config/featureLimits';

interface FeatureUsageResponse {
  allowed: boolean;
  tier?: 'free' | 'premium';
  used?: number;
  remaining?: number | null;
  limit?: number | null;
  error?: string;
  message?: string;
}

interface UsePremiumFeatureGateResult {
  /**
   * Estado de verificación en curso
   */
  checking: boolean;

  /**
   * Verifica si el usuario puede usar una función y ejecuta la acción si está permitido
   * 
   * @param featureKey - Identificador de la función (ej: 'ai_chat', 'barcode_scanner')
   * @param action - Callback a ejecutar si el uso está permitido
   * 
   * @example
   * const { checking, checkAndRun } = usePremiumFeatureGate();
   * 
   * const handleChatClick = () => {
   *   checkAndRun('ai_chat', async () => {
   *     // Abrir interfaz de chat
   *     router.push('/chat');
   *   });
   * };
   */
  checkAndRun: (featureKey: FeatureKey, action: () => void | Promise<void>) => Promise<void>;

  /**
   * Solo verifica si el usuario puede usar la función, sin ejecutar acción
   * Útil para mostrar/ocultar botones o features condicionalmente
   */
  checkOnly: (featureKey: FeatureKey) => Promise<FeatureUsageResponse>;
}

export function usePremiumFeatureGate(): UsePremiumFeatureGateResult {
  const { user, loading: userLoading } = useUser();
  const { showLoginRequired, showLimitReached } = useAuthGateModal();
  const [checking, setChecking] = useState(false);

  const checkOnly = async (featureKey: FeatureKey): Promise<FeatureUsageResponse> => {
    if (!user) {
      return {
        allowed: false,
        error: 'unauthorized',
        message: 'Usuario no autenticado',
      };
    }

    try {
      const res = await fetch('/api/feature-usage/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featureKey }),
      });

      const data: FeatureUsageResponse = await res.json();
      return data;
    } catch (err) {
      console.error('[usePremiumFeatureGate] Error checking feature usage:', err);
      return {
        allowed: false,
        error: 'network_error',
        message: 'Error de conexión',
      };
    }
  };

  const checkAndRun = async (featureKey: FeatureKey, action: () => void | Promise<void>) => {
    // Si todavía está cargando el usuario, esperar
    if (userLoading) {
      console.log('[usePremiumFeatureGate] Waiting for user data...');
      return;
    }

    // Si no hay usuario, mostrar modal de login
    if (!user) {
      showLoginRequired(featureKey);
      return;
    }

    setChecking(true);

    try {
      const res = await fetch('/api/feature-usage/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featureKey }),
      });

      const data: FeatureUsageResponse = await res.json();

      // Si no está permitido
      if (!res.ok || data.allowed === false) {
        // Caso: límite alcanzado
        if (data.error === 'limit_reached') {
          showLimitReached({
            featureKey,
            remaining: data.remaining ?? 0,
            limit: data.limit ?? 0,
          });
          return;
        }

        // Caso: no autorizado (sesión expirada)
        if (res.status === 401 || data.error === 'unauthorized') {
          showLoginRequired(featureKey);
          return;
        }

        // Caso: función no disponible u otro error
        console.error('[usePremiumFeatureGate] Feature not allowed:', data);
        
        // Mostrar modal genérico de error si es necesario
        alert(data.message || 'No se pudo acceder a esta función. Por favor, inténtalo de nuevo.');
        return;
      }

      // Si está permitido, ejecutar la acción
      await action();

      // Opcional: Mostrar aviso si quedan pocos usos
      if (data.tier === 'free' && typeof data.remaining === 'number' && data.remaining <= 3 && data.remaining > 0) {
        console.log(`[usePremiumFeatureGate] Quedan ${data.remaining} usos de ${featureKey} esta semana`);
        // Aquí podrías mostrar un toast/notificación suave
      }
    } catch (err) {
      console.error('[usePremiumFeatureGate] Unexpected error:', err);
      alert('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      setChecking(false);
    }
  };

  return {
    checking,
    checkAndRun,
    checkOnly,
  };
}

/**
 * Hook simplificado para verificar si una función está disponible
 * Sin ejecutar acción, solo para mostrar/ocultar UI
 * 
 * @example
 * const canUseChat = useCanUseFeature('ai_chat');
 * 
 * return (
 *   <button disabled={!canUseChat}>
 *     {canUseChat ? 'Chat con IA' : 'Chat (Premium)'}
 *   </button>
 * );
 */
export function useCanUseFeature(featureKey: FeatureKey): boolean {
  const { user } = useUser();
  const [canUse, setCanUse] = useState(true); // Por defecto true para no bloquear UI inicial

  // TODO: Implementar verificación en useEffect si se necesita
  // Por ahora asumimos que el usuario puede intentarlo (el checkAndRun se encargará del bloqueo)

  return user !== null; // Simplificado: solo verificar si hay usuario
}
