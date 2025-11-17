// src/app/dashboard/badges/badges-client.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Award, Lock, Flame, ChefHat, Trophy } from "lucide-react";

export default function BadgesClient() {
  const [plan, setPlan] = useState<"free" | "premium">("free");

  useEffect(() => {
    const p = document.documentElement.dataset.theme === "premium" ? "premium" : "free";
    setPlan(p);
  }, []);

  // Dummy data
  const badges = [
    {
      id: "first",
      title: "Primer plato cocinado",
      desc: "Cocina tu primera receta.",
      unlocked: true,
      icon: ChefHat,
    },
    {
      id: "consistency",
      title: "3 días seguidos",
      desc: "Cocina durante 3 días seguidos.",
      unlocked: false,
      icon: Flame,
    },
    {
      id: "creator",
      title: "Creador",
      desc: "Publica tu primera receta.",
      unlocked: true,
      icon: Award,
    },
    {
      id: "pro",
      title: "Chef Master",
      desc: "Cocina 50 recetas.",
      unlocked: false,
      icon: Trophy,
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 dark:from-amber-950/20 dark:via-neutral-900 dark:to-yellow-950/20 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-300">Logros</h1>
          <p className="text-sm text-muted-foreground">
            Completa retos, mejora tus habilidades y desbloquea recompensas.
          </p>
        </header>

        {/* GRID DE BADGES */}
        <div className="grid md:grid-cols-2 gap-6">
          {badges.map((b) => (
            <Card
              key={b.id}
              className={cn(
                "border border-amber-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-amber-800/40 p-4 space-y-2 rounded-xl transition",
                plan === "premium" && "glass-card-premium",
                !b.unlocked && "opacity-60"
              )}
            >
              <CardHeader className="pb-1">
                <CardTitle className="text-base flex items-center gap-2 text-amber-900 dark:text-amber-300">
                  <b.icon className="w-5 h-5" />
                  {b.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">{b.desc}</p>

                {b.unlocked ? (
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-700">
                    Desbloqueado ✓
                  </Badge>
                ) : (
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    Pendiente
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* RECOMPENSAS PREMIUM */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300">Recompensas premium</h3>
          <Card
            className={cn(
              "p-4 border border-amber-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-amber-800/40 rounded-xl",
              plan === "premium" && "glass-card-premium"
            )}
          >
            <p className="text-sm">
              Completa 3 módulos de aprendizaje para obtener{" "}
              <span className="font-semibold text-amber-700 dark:text-amber-400">1 mes gratis de Premium</span>.
            </p>
          </Card>
        </section>
      </div>
    </section>
  );
}
