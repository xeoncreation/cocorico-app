/**
 * ErrorBoundary Component
 * 
 * Captura errores de React y los envía al sistema de monitoreo del agente IA
 * Muestra una UI amigable cuando ocurre un error
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { agentMonitor } from '@/lib/agent/agent-monitor';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);

    // Capturar con el agente monitor
    agentMonitor.captureError(error, {
      componentStack: errorInfo.componentStack,
      type: 'react-error-boundary',
      digest: (errorInfo as any).digest,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Si hay un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI por defecto
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-neutral-50 dark:bg-neutral-900">
          <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              ¡Ups! Algo salió mal
            </h1>

            {/* Description */}
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Nuestro agente IA está analizando el problema y trabajando en una solución.
              Intenta recargar la página o vuelve al inicio.
            </p>

            {/* Error details (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-left">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-cocorico-red text-white rounded-full hover:bg-cocorico-red/90 transition-colors font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                Intentar de nuevo
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors font-medium"
              >
                <Home className="w-5 h-5" />
                Ir al inicio
              </button>
            </div>

            {/* Footer */}
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-6">
              El equipo de Cocorico ha sido notificado automáticamente
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;