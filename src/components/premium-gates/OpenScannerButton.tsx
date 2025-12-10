/**
 * Botón de acceso al Escáner de código de barras con control de acceso premium
 */

'use client';

import { useRouter } from 'next/navigation';
import { usePremiumFeatureGate } from '@/hooks/usePremiumFeatureGate';
import { Scan, Loader2 } from 'lucide-react';

interface OpenScannerButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function OpenScannerButton({ 
  className = '', 
  variant = 'primary',
  size = 'md' 
}: OpenScannerButtonProps) {
  const router = useRouter();
  const { checking, checkAndRun } = usePremiumFeatureGate();

  const handleClick = () => {
    checkAndRun('barcode_scanner', async () => {
      // Navegar al escáner
      router.push('/es/scanner');
    });
  };

  const baseClasses = 'rounded-xl font-semibold transition-all flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20',
    secondary: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20',
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
          <Scan className="w-5 h-5" />
          Escanear producto
        </>
      )}
    </button>
  );
}
