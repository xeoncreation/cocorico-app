/**
 * AuthGateModalContext - Sistema de modales para control de acceso
 * 
 * Gestiona dos tipos de modales emergentes:
 * 1. Modal de "Inicia sesión" - cuando usuario no logueado intenta usar función premium
 * 2. Modal de "Límite agotado" - cuando usuario free alcanza límite semanal
 * 
 * @module AuthGateModalContext
 */

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Lock, Zap, Crown } from 'lucide-react';
import { getNextRenewalDate } from '@/lib/feature-usage/period';
import { FEATURE_NAMES, type FeatureKey } from '@/config/featureLimits';

type AuthGateMode = 'login_required' | 'limit_reached' | null;

interface AuthGateState {
  open: boolean;
  mode: AuthGateMode;
  featureKey?: FeatureKey;
  remaining?: number | null;
  limit?: number | null;
}

interface AuthGateContextValue extends AuthGateState {
  showLoginRequired: (featureKey?: FeatureKey) => void;
  showLimitReached: (opts: { featureKey?: FeatureKey; remaining?: number | null; limit?: number | null }) => void;
  close: () => void;
}

const AuthGateModalContext = createContext<AuthGateContextValue | null>(null);

export function AuthGateModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthGateState>({
    open: false,
    mode: null,
  });

  const showLoginRequired = (featureKey?: FeatureKey) =>
    setState({
      open: true,
      mode: 'login_required',
      featureKey,
    });

  const showLimitReached = (opts: { featureKey?: FeatureKey; remaining?: number | null; limit?: number | null }) =>
    setState({
      open: true,
      mode: 'limit_reached',
      featureKey: opts.featureKey,
      remaining: opts.remaining,
      limit: opts.limit,
    });

  const close = () =>
    setState({
      open: false,
      mode: null,
      featureKey: undefined,
      remaining: undefined,
      limit: undefined,
    });

  return (
    <AuthGateModalContext.Provider value={{ ...state, showLoginRequired, showLimitReached, close }}>
      {children}
      <AuthGateModal />
    </AuthGateModalContext.Provider>
  );
}

export function useAuthGateModal() {
  const ctx = useContext(AuthGateModalContext);
  if (!ctx) throw new Error('useAuthGateModal must be used within AuthGateModalProvider');
  return ctx;
}

function AuthGateModal() {
  const { open, mode, close, remaining, limit, featureKey } = useAuthGateModal();
  const router = useRouter();

  if (!open || !mode) return null;

  const featureName = featureKey ? FEATURE_NAMES[featureKey] : 'esta función';

  // Modal de "Inicia sesión"
  if (mode === 'login_required') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-center mb-2 text-neutral-900 dark:text-white">
            Inicia sesión para continuar
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-6">
            Para usar <strong>{featureName}</strong> necesitas tener una cuenta en Cocorico. 
            Inicia sesión o regístrate gratis en unos segundos.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/es/login"
              onClick={close}
              className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 px-6 py-3 text-white font-semibold text-center transition-colors shadow-lg shadow-orange-600/20"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/es/signup"
              onClick={close}
              className="w-full rounded-xl border-2 border-orange-600 px-6 py-3 text-orange-600 dark:text-orange-400 font-semibold text-center hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
            >
              Crear cuenta gratis
            </Link>
          </div>

          <button
            onClick={close}
            className="mt-4 w-full text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            Seguir navegando sin usar esta función
          </button>
        </div>
      </div>
    );
  }

  // Modal de "Límite agotado"
  if (mode === 'limit_reached') {
    const used = typeof limit === 'number' && typeof remaining === 'number' ? limit - remaining : 0;
    const renewalDate = getNextRenewalDate('es');

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <Zap className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-center mb-2 text-neutral-900 dark:text-white">
            Has agotado tus usos gratuitos
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4">
            Has utilizado todos los usos semanales gratuitos de <strong>{featureName}</strong>.
          </p>

          {/* Usage stats */}
          {typeof used === 'number' && typeof limit === 'number' && (
            <div className="mb-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-neutral-600 dark:text-neutral-400">Usos esta semana</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {used} / {limit}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                  style={{ width: `${(used / limit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
                Se renueva el {renewalDate}
              </p>
            </div>
          )}

          <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-6">
            Suscríbete a Cocorico Premium para usar todas las funciones sin límites.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/es/premium"
              onClick={close}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-6 py-3 text-white font-semibold text-center transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Ver planes Premium
            </Link>
            <button
              onClick={close}
              className="w-full rounded-xl border-2 border-neutral-300 dark:border-neutral-700 px-6 py-3 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
