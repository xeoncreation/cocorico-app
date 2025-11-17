// src/app/[locale]/plans/plans-client.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, X, Star, Sparkles, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PlansClient() {
  const [plan, setPlan] = useState<"free" | "premium">("free");

  useEffect(() => {
    const p = document.documentElement.dataset.theme === "premium" ? "premium" : "free";
    setPlan(p);
  }, []);

  // Función de checkout
  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
      });

      if (res.ok) {
        const { url } = await res.json();
        window.location.href = url;
      } else {
        alert("Error al crear sesión de pago. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión. Verifica tu red.");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 dark:from-amber-950/20 dark:via-neutral-900 dark:to-yellow-950/20 py-8">
      <div className="space-y-16">
        {/* ----------------------------- */}
        {/* HERO DE PLANES                */}
        {/* ----------------------------- */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-300">
            ⭐ Elige tu plan
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cocorico se adapta a ti. Empieza gratis o desbloquea todo el poder del modo Premium Liquid Glass.
          </p>
        </section>

        {/* ----------------------------- */}
        {/* COMPARATIVA DE PLANES         */}
        {/* ----------------------------- */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* FREE */}
          <Card className="border border-neutral-200/60 dark:border-neutral-800/40 bg-white/80 dark:bg-neutral-900/80 p-6 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-neutral-900 dark:text-neutral-100">
                Free
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">0 €</p>
                <p className="text-sm text-muted-foreground">/ mes</p>
              </div>

              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> 
                  <span>Búsqueda básica de recetas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> 
                  <span>Crear y compartir recetas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> 
                  <span>Comunidad y comentarios</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" /> 
                  <span className="text-muted-foreground">Liquid Glass UI</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" /> 
                  <span className="text-muted-foreground">Aprendizaje avanzado</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0" /> 
                  <span className="text-muted-foreground">Estadísticas ilimitadas</span>
                </li>
              </ul>

              {plan === "free" && (
                <Button 
                  className="w-full rounded-xl h-12 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600" 
                  onClick={handleUpgrade}
                >
                  Actualizar a Premium
                </Button>
              )}
            </CardContent>
          </Card>

          {/* PREMIUM */}
          <Card
            className={cn(
              "border border-amber-300/60 dark:border-amber-600/40 p-6 rounded-2xl shadow-2xl relative",
              "bg-gradient-to-br from-amber-50/80 to-yellow-50/80 dark:from-amber-900/20 dark:to-yellow-900/20",
              plan === "premium" && "glass-card-premium"
            )}
          >
            <div className="absolute -top-3 -right-3">
              <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Crown className="w-3 h-3" /> POPULAR
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-amber-900 dark:text-amber-300">
                <Star className="w-6 h-6" /> Premium
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <p className="text-4xl font-bold text-amber-900 dark:text-amber-300">4,99 €</p>
                <p className="text-sm text-muted-foreground">/ mes</p>
              </div>

              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" /> 
                  <span className="font-medium">Todo de Free +</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" /> 
                  <span>Liquid Glass Full UI</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" /> 
                  <span>Aprendizaje con vídeos</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" /> 
                  <span>Estadísticas detalladas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" /> 
                  <span>Badges exclusivos</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" /> 
                  <span>Soporte prioritario</span>
                </li>
              </ul>

              <Button 
                className="w-full rounded-xl h-12 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold" 
                onClick={handleUpgrade}
              >
                <Sparkles className="w-4 h-4 mr-2" /> Ir a Premium
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* ----------------------------- */}
        {/* TESTIMONIOS                   */}
        {/* ----------------------------- */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-amber-900 dark:text-amber-300">
            💬 Opiniones reales
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className={cn(
                "p-6 border border-blue-200/60 bg-blue-50/80 dark:bg-blue-900/20 dark:border-blue-800/40 rounded-xl",
                plan === "premium" && "glass-card-premium"
              )}
            >
              <p className="text-sm italic mb-4">
                "Premium me cambió la forma de cocinar. Los vídeos, los badges y el diseño glass… increíble."
              </p>
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                — María, Chef Premium
              </p>
            </Card>

            <Card
              className={cn(
                "p-6 border border-purple-200/60 bg-purple-50/80 dark:bg-purple-900/20 dark:border-purple-800/40 rounded-xl",
                plan === "premium" && "glass-card-premium"
              )}
            >
              <p className="text-sm italic mb-4">
                "Las estadísticas me motivan muchísimo. Ver mi progreso me hace cocinar más cada día."
              </p>
              <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                — Carlos, Usuario Premium
              </p>
            </Card>
          </div>
        </section>

        {/* ----------------------------- */}
        {/* FAQ */}
        {/* ----------------------------- */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-amber-900 dark:text-amber-300">
            ❓ Preguntas frecuentes
          </h2>

          <div className="space-y-4 max-w-3xl mx-auto">
            <Card className="p-5 border border-neutral-200/60 dark:border-neutral-800/40 bg-white/80 dark:bg-neutral-900/80 rounded-xl">
              <p className="font-semibold mb-2">¿Puedo cancelar cuando quiera?</p>
              <p className="text-sm text-muted-foreground">
                Sí, sin permanencia. Cancela desde tu panel de usuario en cualquier momento.
              </p>
            </Card>

            <Card className="p-5 border border-neutral-200/60 dark:border-neutral-800/40 bg-white/80 dark:bg-neutral-900/80 rounded-xl">
              <p className="font-semibold mb-2">¿Cómo funciona el efecto Liquid Glass?</p>
              <p className="text-sm text-muted-foreground">
                La UI activa blur dinámico, transparencias y transiciones suaves exclusivas para suscriptores Premium.
              </p>
            </Card>

            <Card className="p-5 border border-neutral-200/60 dark:border-neutral-800/40 bg-white/80 dark:bg-neutral-900/80 rounded-xl">
              <p className="font-semibold mb-2">¿Qué métodos de pago aceptan?</p>
              <p className="text-sm text-muted-foreground">
                Procesamos pagos seguros a través de Stripe: tarjetas de crédito/débito, Google Pay y Apple Pay.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </section>
  );
}
