/**
 * Botón de acceso al Chat Unificado con control de acceso premium
 * 
 * Implementa el sistema de gates:
 * - Usuario no logueado → Modal de login
 * - Usuario free con límite alcanzado → Modal de límite
 * - Usuario premium o con usos disponibles → Navega al chat
 */

'use client';

import { useRouter } from 'next/navigation';
import { usePremiumFeatureGate } from '@/hooks/usePremiumFeatureGate';
import { MessageSquare, Loader2 } from 'lucide-react';

interface OpenChatButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function OpenChatButton({ 
  className = '', 
  variant = 'primary',
  size = 'md' 
}: OpenChatButtonProps) {
  const router = useRouter();
  const { checking, checkAndRun } = usePremiumFeatureGate();

  const handleClick = () => {
    checkAndRun('ai_chat', async () => {
      // Si está permitido, navegar al chat unificado
      router.push('/es/chat-unificado');
    });
  };

  const baseClasses = 'rounded-xl font-semibold transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20',
    secondary: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20',
    ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={handleClick}
      disabled={checking}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {checking ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Comprobando...
        </>
      ) : (
        <>
          <MessageSquare className="w-5 h-5" />
          Chat con IA
        </>
      )}
    </button>
  );
}
