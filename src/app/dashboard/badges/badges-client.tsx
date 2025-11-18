// src/app/dashboard/badges/badges-client.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Award, Lock, Flame, ChefHat, Trophy } from "lucide-react";

type SimpleBadge = { id: string; title: string; desc: string; unlocked: boolean; icon: any };

export default function BadgesClient() {
  const [plan, setPlan] = useState<"free" | "premium">("free");
  useEffect(() => { setPlan(document.documentElement.dataset.theme === "premium" ? "premium" : "free"); }, []);

  const badges: SimpleBadge[] = [
    { id: "first", title: "Primer plato cocinado", desc: "Cocina tu primera receta.", unlocked: true, icon: ChefHat },
    { id: "consistency", title: "3 días seguidos", desc: "Cocina durante 3 días seguidos.", unlocked: false, icon: Flame },
    { id: "creator", title: "Creador", desc: "Publica tu primera receta.", unlocked: true, icon: Award },
    { id: "pro", title: "Chef Master", desc: "Cocina 50 recetas.", unlocked: false, icon: Trophy },
  ];

  return (
    <section className="py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold">Logros</h1>
          <p className="text-sm text-muted-foreground">Completa retos y desbloquea recompensas.</p>
        </header>
        <div className="grid md:grid-cols-2 gap-6">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.id} className={cn("glass-card glass-card-orange glass-frosted-border p-4 space-y-2 rounded-xl transition", !b.unlocked && "opacity-60")}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="w-5 h-5" /> {b.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{b.desc}</p>
                  {b.unlocked ? (
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-700">Desbloqueado ✓</Badge>
                  ) : (
                    <span className="flex items-center gap-2 text-xs text-muted-foreground"><Lock className="w-3 h-3" /> Pendiente</span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recompensas premium</h3>
          <Card className="glass-card glass-card-purple glass-frosted-border p-4 rounded-xl">
            <p className="text-sm">Completa 3 módulos de aprendizaje para obtener <span className="font-semibold">1 mes gratis de Premium</span>.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
