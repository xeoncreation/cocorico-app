// src/app/dashboard/stats/stats-client.tsx
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Timer,
  ChefHat,
  Flame,
  Download,
  TrendingUp,
  Award,
} from "lucide-react";

import { cn } from "@/lib/utils";

export default function StatsClient() {
  const [plan, setPlan] = useState<"free" | "premium">("free");

  useEffect(() => {
    const p = document.documentElement.dataset.theme === "premium" ? "premium" : "free";
    setPlan(p);
  }, []);

  // Dummy data reemplazable por Supabase
  const [stats, setStats] = useState<null | { totalRecipes: number; totalFavorites: number; totalMinutes: number; unlockedBadges: number }>(null);
  const [monthlyRecipes, setMonthlyRecipes] = useState<{ month: string; value: number }[]>([]);
  const [categoryFavorites, setCategoryFavorites] = useState<{ category: string; value: number }[]>([]);
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/dashboard/stats');
      if (res.ok) {
        const json = await res.json();
        setStats(json);
        setMonthlyRecipes([
          { month: 'Ene', value: Math.max(1, Math.round(json.totalRecipes / 6)) },
          { month: 'Feb', value: Math.max(1, Math.round(json.totalRecipes / 5)) },
          { month: 'Mar', value: Math.max(1, Math.round(json.totalRecipes / 4)) },
          { month: 'Abr', value: Math.max(1, Math.round(json.totalRecipes / 3)) },
          { month: 'May', value: Math.max(1, Math.round(json.totalRecipes / 2)) },
          { month: 'Jun', value: json.totalRecipes },
        ]);
        setCategoryFavorites([
          { category: 'Pasta', value: Math.round(json.totalFavorites * 0.4) },
          { category: 'Veggie', value: Math.round(json.totalFavorites * 0.25) },
            { category: 'Sopas', value: Math.round(json.totalFavorites * 0.15) },
            { category: 'Postres', value: Math.max(1, json.totalFavorites - Math.round(json.totalFavorites * 0.8)) },
        ]);
      }
    })();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-purple-50/80 via-white to-violet-50/60 dark:from-purple-950/20 dark:via-neutral-900 dark:to-violet-950/20 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* TÍTULO */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-300">Tus estadísticas</h1>
          <p className="text-sm text-muted-foreground">
            Evolución culinaria, hábitos y comparativas.
          </p>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* RECETAS CREADAS */}
          <Card
            className={cn(
              "glass-card glass-card-purple glass-frosted-border",
              plan === "premium" && ""
            )}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-purple-900 dark:text-purple-300">
                <ChefHat className="w-4 h-4" />
                Recetas creadas (últimos 6 meses)
              </CardTitle>
            </CardHeader>

            <CardContent className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRecipes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--color-text)" />
                  <YAxis stroke="var(--color-text)" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="rgb(147, 51, 234)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* FAVORITOS POR CATEGORÍA */}
          <Card
            className={cn(
              "glass-card glass-card-orange glass-frosted-border",
              plan === "premium" && ""
            )}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-purple-900 dark:text-purple-300">
                <Flame className="w-4 h-4" />
                Categorías favoritas
              </CardTitle>
            </CardHeader>

            <CardContent className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryFavorites}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="category" stroke="var(--color-text)" />
                  <YAxis stroke="var(--color-text)" />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="rgb(167, 139, 250)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* TIEMPO TOTAL */}
          <Card
            className={cn(
              "glass-card glass-card-green glass-frosted-border space-y-3",
              plan === "premium" && ""
            )}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-purple-900 dark:text-purple-300">
                <Timer className="w-4 h-4" />
                Tiempo total cocinando
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{stats ? `${Math.round((stats.totalMinutes||0)/60)} horas` : '--'}</p>
              <p className="text-xs text-muted-foreground">
                Acumulado durante los últimos meses.
              </p>

              <Button variant="outline" size="sm" className="rounded-xl">
                <TrendingUp className="w-4 h-4 mr-1" />
                Ver evolución detallada
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* COMPARATIVA CON LA COMUNIDAD */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300">Tu posición en la comunidad</h3>

          <Card
            className={cn(
              "glass-card glass-card-blue glass-frosted-border rounded-xl",
              plan === "premium" && ""
            )}
          >
            <p className="text-sm">
              Estás dentro del{" "}
              <span className="text-purple-600 dark:text-purple-400 font-semibold">top 18%</span> de usuarios
              más activos este mes.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {stats ? `Recetas: ${stats.totalRecipes} · Favoritos: ${stats.totalFavorites}` : 'Cargando métricas...'}
            </p>
          </Card>
        </section>

        {/* EXPORTACIÓN */}
        <section>
          <Button size="sm" className="rounded-xl bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
            <Download className="w-4 h-4 mr-1" />
            Exportar estadísticas (PDF / CSV)
          </Button>
        </section>
      </div>
    </section>
  );
}
