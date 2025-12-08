import { ReactNode } from "react";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Sparkles } from "lucide-react";
import Link from "next/link";

interface PremiumGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  featureName?: string;
  showUpgrade?: boolean;
}

/**
 * PremiumGate Component
 * 
 * Protege contenido premium y muestra CTA de upgrade si el usuario no es premium
 * 
 * @example
 * <PremiumGate featureName="Generador de Recetas IA">
 *   <AIRecipeGenerator />
 * </PremiumGate>
 */
export default function PremiumGate({
  children,
  fallback,
  featureName = "función premium",
  showUpgrade = true,
}: PremiumGateProps) {
  const { isPremium, loading } = usePremiumStatus();

  if (loading) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Verificando acceso...
        </p>
      </GlassCard>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  // Si hay un fallback personalizado, usarlo
  if (fallback) {
    return <>{fallback}</>;
  }

  // Mostrar CTA de upgrade por defecto
  if (showUpgrade) {
    return (
      <GlassCard variant="premium" className="p-8 text-center">
        <div className="max-w-md mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="heading-2 glass-text-premium mb-3">
            Función Premium 🌟
          </h3>

          {/* Description */}
          <p className="body-regular text-white/80 mb-6">
            <strong>{featureName}</strong> es una función exclusiva para
            usuarios premium. Upgrade ahora y desbloquea todo el potencial de
            Cocorico.
          </p>

          {/* Features List */}
          <div className="text-left mb-6 space-y-2">
            {[
              "Acceso ilimitado a IA GPT-4",
              "Escaneo HD premium",
              "Chat exclusivo",
              "Sin anuncios",
              "Retos premium",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link href="/es/premium">
            <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold">
              <Crown className="w-5 h-5 mr-2" />
              Upgrade a Premium
            </Button>
          </Link>

          {/* Footer */}
          <p className="text-xs text-white/50 mt-4">
            Solo $49.99/año - Cancela cuando quieras
          </p>
        </div>
      </GlassCard>
    );
  }

  // Si showUpgrade = false, mostrar mensaje simple bloqueado
  return (
    <GlassCard className="p-8 text-center border-2 border-amber-500/30">
      <Lock className="w-12 h-12 text-amber-500 mx-auto mb-4" />
      <p className="text-neutral-600 dark:text-neutral-400">
        Esta función requiere una cuenta Premium
      </p>
    </GlassCard>
  );
}
