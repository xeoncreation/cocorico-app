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
    <section className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-indigo-950/40 dark:via-blue-900/30 dark:to-purple-950/40 py-12 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[2fr,1fr] gap-8 items-start">
        {/* CURSOS */}
        <div className="space-y-6">
          <h2 className={cn(
            "text-2xl font-bold flex items-center gap-3 mb-4",
            plan === "premium" ? "glass-text-premium" : "text-blue-900 dark:text-blue-300"
          )}>
            <BookOpen className="w-6 h-6" />
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
              <CardTitle className={cn(
                "text-lg font-bold flex items-center gap-3",
                plan === "premium" && "glass-text-premium"
              )}>
                <ChefHat className="w-5 h-5" />
                {mod.title}
              </CardTitle>
              <div className="flex gap-3 text-sm mt-2">
                <span className={cn(
                  "px-3 py-1 rounded-lg font-medium",
                  plan === "premium" ? "glass-droplet" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                )}>
                  {mod.level}
                </span>
                <span className={plan === "premium" ? "text-white/80" : "text-muted-foreground"}>
                  ⏱️ {mod.estimated} min
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Lista de lecciones */}
              {mod.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={cn(
                    "p-4 border rounded-2xl flex items-center justify-between transition-all hover:scale-102",
                    plan === "premium" ? "glass-droplet" : "bg-white/80 dark:bg-neutral-800/80 border-blue-200 dark:border-blue-800 hover:shadow-lg"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      plan === "premium" ? "glass-droplet" : "bg-blue-100 dark:bg-blue-900/30"
                    )}>
                      <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className={cn(
                      "text-base font-medium",
                      plan === "premium" && "glass-text-premium"
                    )}>
                      {lesson.title}
                    </span>
                  </div>

                  {/* Reproductor: placeholder boton */}
                  <Button 
                    size="sm" 
                    className={cn(
                      "rounded-xl",
                      plan === "premium" && "glass-button-premium"
                    )}
                  >
                    Ver
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
            "border rounded-3xl",
            plan === "premium" ? "glass-card-premium" : "bg-white/80 dark:bg-neutral-900/80 border-blue-200 dark:border-blue-800"
          )}
        >
          <CardHeader>
            <CardTitle className={cn(
              "text-base font-bold flex items-center gap-2",
              plan === "premium" && "glass-text-premium"
            )}>
              <GraduationCap className="w-5 h-5" />
              Logros educativos
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <Badge className={cn(
              "px-3 py-1 rounded-lg",
              plan === "premium" && "glass-droplet"
            )}>
              ✅ Primer módulo completado
            </Badge>
            <Badge className={cn(
              "px-3 py-1 rounded-lg",
              plan === "premium" && "glass-droplet"
            )}>
              🔪 Cortes avanzados
            </Badge>

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
      </div>
    </section>
  );
}
