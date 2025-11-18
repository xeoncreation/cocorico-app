"use client";

import { useState } from "react";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface Module {
  id: string;
  title: string;
  description: string;
  slug: string;
  duration_minutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  cover_image_url: string | null;
  is_completed: boolean;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LearnClient({ locale }: { locale: string }) {
  const t = useTranslations("Learn");
  const { data, error, isLoading } = useSWR<{ modules: Module[] }>(
    "/api/learn/modules",
    fetcher
  );

  const modules = data?.modules || [];

  // Group by category
  const categories = Array.from(new Set(modules.map((m) => m.category)));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("title") || "Learn"}</h1>

      {isLoading && <p className="text-muted-foreground">{t("loading") || "Loading modules..."}</p>}
      {error && <p className="text-destructive">{t("error") || "Failed to load modules."}</p>}

      <div className="space-y-8">
        {categories.map((category) => {
          const categoryModules = modules.filter((m) => m.category === category);
          return (
            <div key={category}>
              <h2 className="text-2xl font-semibold mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryModules.map((module) => {
                  const progressValue = module.is_completed ? 100 : 0;
                  return (
                    <Link
                      key={module.id}
                      href={`/${locale}/learn/${module.slug}`}
                      className="block bg-card border border-border rounded-lg p-4 hover:shadow-lg transition"
                    >
                      {module.cover_image_url && (
                        <img
                          src={module.cover_image_url}
                          alt={module.title}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-lg mb-1">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {module.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{module.duration_minutes} min</span>
                        <span className="capitalize">{module.difficulty}</span>
                      </div>
                      {/* Simple progress bar */}
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`bg-primary h-2 rounded-full transition-all ${
                            progressValue === 100 ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                      {module.is_completed && (
                        <p className="text-xs text-primary mt-1">{t("completed") || "✓ Completed"}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!isLoading && modules.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          {t("no_modules") || "No learning modules available yet."}
        </p>
      )}
    </div>
  );
}
