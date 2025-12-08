"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Crown, Check, Sparkles, ArrowRight } from "lucide-react";
import { AppBackground } from "@/components/layout/AppBackground";
import confetti from "canvas-confetti";

export default function CheckoutSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    verifyPayment();
    // Lanzar confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const verifyPayment = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/es/login");
        return;
      }

      // Verificar que el usuario ahora es premium
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setError("Error al verificar tu cuenta premium");
        setLoading(false);
        return;
      }

      if (!profile?.is_premium) {
        // El webhook puede tardar unos segundos, esperar un poco y reintentar
        setTimeout(async () => {
          const { data: retryProfile } = await supabase
            .from("profiles")
            .select("is_premium")
            .eq("id", user.id)
            .single();

          if (!retryProfile?.is_premium) {
            setError(
              "Tu pago fue exitoso pero aún estamos procesando tu upgrade. Esto puede tomar unos minutos."
            );
          }
          setLoading(false);
        }, 3000);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error verifying payment:", err);
      setError("Error al verificar el pago");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppBackground variantOverride="home-premium">
        <div className="min-h-screen flex items-center justify-center py-8 px-4">
          <GlassCard variant="premium" className="p-12 text-center max-w-md">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="heading-2 glass-text-premium mb-2">
              Procesando tu upgrade...
            </h2>
            <p className="body-regular text-white/70">
              Esto solo tomará un momento
            </p>
          </GlassCard>
        </div>
      </AppBackground>
    );
  }

  if (error) {
    return (
      <AppBackground variantOverride="home-premium">
        <div className="min-h-screen flex items-center justify-center py-8 px-4">
          <GlassCard variant="premium" className="p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="heading-2 glass-text-premium mb-4">
              ¡Pago Procesado!
            </h2>
            <p className="body-regular text-white/80 mb-6">{error}</p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/es/dashboard")}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              >
                Ir al Dashboard
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Reintentar verificación
              </Button>
            </div>
          </GlassCard>
        </div>
      </AppBackground>
    );
  }

  return (
    <AppBackground variantOverride="home-premium">
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <GlassCard variant="premium" className="p-12 text-center max-w-2xl">
          {/* Success Icon */}
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-500">
              <Crown className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="heading-display glass-text-premium mb-4">
            ¡Bienvenido a Premium! 🎉
          </h1>
          <p className="body-large text-white/80 mb-8">
            Tu pago fue procesado exitosamente. Ahora tienes acceso completo a
            todas las funciones premium de Cocorico.
          </p>

          {/* Features List */}
          <GlassCard variant="accent" className="p-6 mb-8 text-left">
            <h3 className="label-strong text-white mb-4">
              ✨ Ya puedes disfrutar de:
            </h3>
            <div className="space-y-3">
              {[
                "Recetas ilimitadas con IA GPT-4",
                "Escaneo HD y análisis nutricional completo",
                "Chat premium con salas exclusivas",
                "Experiencia sin anuncios",
                "Modo Cocina Plus con timer inteligente",
                "Retos exclusivos semanales",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="body-regular text-white/90">{feature}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push("/es/recipes/generate")}
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generar receta con IA
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => router.push("/es/dashboard")}
              variant="outline"
              className="flex-1 h-12"
            >
              Ir al Dashboard
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-white/50 mt-8">
            Recibirás un email de confirmación en breve. Si tienes alguna
            pregunta, contacta a soporte@cocorico.app
          </p>
        </GlassCard>
      </div>
    </AppBackground>
  );
}
