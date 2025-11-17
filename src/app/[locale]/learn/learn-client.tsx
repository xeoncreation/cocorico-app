"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, ChefHat, BookOpen, PlayCircle, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LearnClient() {
  const plan = typeof document !== "undefined"
    ? (document.documentElement.dataset.theme as "free" | "premium")
    : "free";

  const modules = [
    {
      id: "m1",
      title: "Fundamentos de cocina",
      level: "Beginner",
      estimated: 40,
      lessons: [
        {
          id: "l1",
          title: "Cortes básicos",
          youtube_id: "dQw4w9WgXcQ",
        },
        {
          id: "l2",
          title: "Sofritos perfectos",
          video_path: "videos/sofreir-basico.mp4",
        },
      ],
    },
  ];

  const glossary = [
    { term: "Mise en place", def: "Preparar todo antes de cocinar." },
    { term: "Blanquear", def: "Escaldar y enfriar rápidamente." },
  ];

  const resources = [
    { id: "r1", title: "Planificador semanal", href: "/downloads/planificador.pdf" },
    { id: "r2", title: "Checklist despensa", href: "/downloads/despensa.pdf" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 dark:from-blue-950/20 dark:via-neutral-900 dark:to-sky-950/20 py-8 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[2fr,1fr] gap-6 items-start">
        {/* CURSOS */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-900 dark:text-blue-300">
            <BookOpen className="w-5 h-5" />
            Rutas de aprendizaje
          </h2>

          {modules.map((mod) => (
            <Card
              key={mod.id}
              className={cn(
                "border border-blue-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-blue-800/40",
                plan === "premium" && "glass-card-premium"
              )}
            >
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-primary" />
                {mod.title}
              </CardTitle>
              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                <span>{mod.level}</span>
                <span>{mod.estimated} min</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Lista de lecciones */}
              {mod.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={cn(
                    "p-3 border rounded-xl flex items-center justify-between",
                    plan === "premium" && "bg-white/10 border-white/20 backdrop-blur-xl"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm">{lesson.title}</span>
                  </div>

                  {/* Reproductor: placeholder boton */}
                  <Button size="icon" variant="ghost" className="h-7 w-7">
                    <PlayCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Panel lateral */}
      <aside className="space-y-6">
        {/* LOGROS EDUCATIVOS */}
        <Card
          className={cn(
            "border border-border/60 bg-surface",
            plan === "premium" && "bg-white/10 border-white/20 backdrop-blur-xl"
          )}
        >
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              Logros educativos
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-xs">
            <Badge variant="outline">Primer módulo completado</Badge>
            <Badge variant="outline">Cortes avanzados</Badge>

            <Button
              asChild
              size="sm"
              variant="ghost"
              className="mt-2 px-0 text-xs"
            >
              <a href="/dashboard/badges">Ver todos →</a>
            </Button>
          </CardContent>
        </Card>

        {/* GLOSARIO */}
        <Card
          className={cn(
            "border border-border/60 bg-surface",
            plan === "premium" && "bg-white/10 border-white/20 backdrop-blur-xl"
          )}
        >
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              Glosario
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-xs">
            {glossary.map((g) => (
              <div key={g.term}>
                <p className="font-semibold">{g.term}</p>
                <p className="text-muted-foreground">{g.def}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* RECURSOS */}
        <Card
          className={cn(
            "border border-border/60 bg-surface",
            plan === "premium" && "bg-white/10 border-white/20 backdrop-blur-xl"
          )}
        >
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              Recursos descargables
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-xs">
            {resources.map((r) => (
              <div
                key={r.id}
                className={cn(
                  "flex justify-between border p-2 rounded-lg",
                  plan === "premium" && "bg-white/10 border-white/20 backdrop-blur-xl"
                )}
              >
                <span>{r.title}</span>
                <a
                  href={r.href}
                  download
                  className="text-primary text-xs underline"
                >
                  Descargar
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}
