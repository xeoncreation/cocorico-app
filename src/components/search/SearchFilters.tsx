// src/components/search/SearchFilters.tsx
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchFilterState = {
  maxTime: number;
  difficulty: string[];
  diets: string[];
  ingredients: string[];
};

export default function SearchFilters({
  value,
  onChange,
  plan,
}: {
  value: SearchFilterState;
  onChange: (s: SearchFilterState) => void;
  plan: "free" | "premium";
}) {
  const [open, setOpen] = useState(false);
  const [ingInput, setIngInput] = useState("");

  const update = (patch: Partial<SearchFilterState>) =>
    onChange({ ...value, ...patch });

  const addIngredient = () => {
    const v = ingInput.trim().toLowerCase();
    if (!v) return;
    if (!value.ingredients.includes(v)) {
      update({ ingredients: [...value.ingredients, v] });
    }
    setIngInput("");
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((s) => !s)}
        className={cn(
          "rounded-xl",
          plan === "premium" && "bg-white/10 backdrop-blur-xl border-white/20"
        )}
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        Filtros
      </Button>

      {open && (
        <div
          className={cn(
            "w-full p-4 space-y-4 border rounded-2xl",
            plan === "premium" &&
              "bg-white/10 backdrop-blur-xl border-white/20 shadow-xl"
          )}
        >
          {/* Tiempo */}
          <section className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tiempo máximo</span>
              <span>{value.maxTime} min</span>
            </div>
            <input
              type="range"
              min={5}
              max={180}
              step={5}
              value={value.maxTime}
              onChange={(e) => update({ maxTime: Number(e.target.value) })}
              className="w-full"
              aria-label="Tiempo máximo (minutos)"
            />
          </section>

          {/* Dificultad */}
          <section className="space-y-2">
            <span className="text-xs text-muted-foreground">Dificultad</span>
            <div className="flex gap-2 flex-wrap">
              {["easy", "medium", "hard"].map((dif) => (
                <Badge
                  key={dif}
                  onClick={() =>
                    update({
                      difficulty: value.difficulty.includes(dif)
                        ? value.difficulty.filter((d) => d !== dif)
                        : [...value.difficulty, dif],
                    })
                  }
                  className={cn(
                    "cursor-pointer",
                    value.difficulty.includes(dif) &&
                      "bg-primary text-primary-foreground"
                  )}
                >
                  {dif === "easy" && "Fácil"}
                  {dif === "medium" && "Media"}
                  {dif === "hard" && "Difícil"}
                </Badge>
              ))}
            </div>
          </section>

          {/* Dietas */}
          <section className="space-y-2">
            <span className="text-xs text-muted-foreground">Dieta</span>
            <div className="flex flex-wrap gap-2">
              {["vegetariana", "vegana", "sin gluten", "low carb"].map(
                (diet) => (
                  <Badge
                    key={diet}
                    className={cn(
                      "cursor-pointer",
                      value.diets.includes(diet) &&
                        "bg-secondary text-secondary-foreground"
                    )}
                    onClick={() =>
                      update({
                        diets: value.diets.includes(diet)
                          ? value.diets.filter((d) => d !== diet)
                          : [...value.diets, diet],
                      })
                    }
                  >
                    {diet}
                  </Badge>
                )
              )}
            </div>
          </section>

          {/* Ingredientes */}
          <section className="space-y-2">
            <span className="text-xs text-muted-foreground">Ingredientes</span>
            <div className="flex gap-2">
              <Input
                placeholder="Añade ingrediente y pulsa Enter"
                value={ingInput}
                onChange={(e) => setIngInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIngredient();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addIngredient}>
                Añadir
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {value.ingredients.map((i) => (
                <Badge
                  key={i}
                  className="cursor-pointer flex items-center gap-1"
                  onClick={() =>
                    update({
                      ingredients: value.ingredients.filter((x) => x !== i),
                    })
                  }
                >
                  {i}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
