"use client";

import { useState } from "react";
import { Filter, X, Clock, ChefHat, Utensils, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface RecipeFilters {
  maxTime?: number;
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
  diet?: string[];
  sortBy?: "recent" | "popular" | "rating" | "time";
}

interface RecipeFiltersProps {
  filters: RecipeFilters;
  onChange: (filters: RecipeFilters) => void;
  onReset: () => void;
}

const DIFFICULTIES = [
  { value: "easy", label: "Fácil", icon: "🌟" },
  { value: "medium", label: "Media", icon: "⭐⭐" },
  { value: "hard", label: "Difícil", icon: "⭐⭐⭐" },
];

const TIME_OPTIONS = [
  { value: 15, label: "< 15 min" },
  { value: 30, label: "< 30 min" },
  { value: 60, label: "< 1 hora" },
  { value: 120, label: "< 2 horas" },
];

const CATEGORIES = [
  { value: "breakfast", label: "Desayuno", icon: "🥐" },
  { value: "lunch", label: "Almuerzo", icon: "🍽️" },
  { value: "dinner", label: "Cena", icon: "🍖" },
  { value: "dessert", label: "Postre", icon: "🍰" },
  { value: "snack", label: "Snack", icon: "🍿" },
  { value: "beverage", label: "Bebida", icon: "🥤" },
];

const DIETS = [
  { value: "vegetarian", label: "Vegetariana", icon: "🥬" },
  { value: "vegan", label: "Vegana", icon: "🌱" },
  { value: "gluten-free", label: "Sin Gluten", icon: "🌾" },
  { value: "dairy-free", label: "Sin Lácteos", icon: "🥛" },
  { value: "keto", label: "Keto", icon: "🥑" },
  { value: "paleo", label: "Paleo", icon: "🍖" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Más Recientes", icon: Clock },
  { value: "popular", label: "Más Populares", icon: Utensils },
  { value: "rating", label: "Mejor Valoradas", icon: ChefHat },
  { value: "time", label: "Más Rápidas", icon: Clock },
];

export default function RecipeFiltersComponent({
  filters,
  onChange,
  onReset,
}: RecipeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount =
    (filters.maxTime ? 1 : 0) +
    (filters.difficulty ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.diet?.length || 0);

  const toggleDiet = (diet: string) => {
    const current = filters.diet || [];
    const updated = current.includes(diet)
      ? current.filter((d) => d !== diet)
      : [...current, diet];
    onChange({ ...filters, diet: updated });
  };

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle + Sort */}
      <div className="flex gap-3">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="coco-glass flex-shrink-0"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-cocorico-red text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <Select
          value={filters.sortBy || "recent"}
          onValueChange={(value: any) =>
            onChange({ ...filters, sortBy: value })
          }
        >
          <SelectTrigger className="coco-glass flex-1">
            <SelectValue placeholder="Ordenar por..." />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {opt.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.maxTime && (
            <Badge
              variant="secondary"
              className="coco-glass cursor-pointer hover:bg-red-500/20"
              onClick={() => onChange({ ...filters, maxTime: undefined })}
            >
              &lt; {filters.maxTime} min
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filters.difficulty && (
            <Badge
              variant="secondary"
              className="coco-glass cursor-pointer hover:bg-red-500/20"
              onClick={() => onChange({ ...filters, difficulty: undefined })}
            >
              {DIFFICULTIES.find((d) => d.value === filters.difficulty)?.icon}{" "}
              {DIFFICULTIES.find((d) => d.value === filters.difficulty)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filters.category && (
            <Badge
              variant="secondary"
              className="coco-glass cursor-pointer hover:bg-red-500/20"
              onClick={() => onChange({ ...filters, category: undefined })}
            >
              {CATEGORIES.find((c) => c.value === filters.category)?.icon}{" "}
              {CATEGORIES.find((c) => c.value === filters.category)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          )}
          {filters.diet?.map((diet) => (
            <Badge
              key={diet}
              variant="secondary"
              className="coco-glass cursor-pointer hover:bg-red-500/20"
              onClick={() => toggleDiet(diet)}
            >
              {DIETS.find((d) => d.value === diet)?.icon}{" "}
              {DIETS.find((d) => d.value === diet)?.label}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs"
          >
            Limpiar todo
          </Button>
        </div>
      )}

      {/* Filters Panel */}
      {isOpen && (
        <GlassCard className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
          {/* Time Filter */}
          <div className="space-y-3">
            <label className="label-strong flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tiempo Máximo
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TIME_OPTIONS.map((time) => (
                <Button
                  key={time.value}
                  variant={filters.maxTime === time.value ? "default" : "outline"}
                  className={
                    filters.maxTime === time.value
                      ? "bg-cocorico-red text-white"
                      : "coco-glass"
                  }
                  onClick={() =>
                    onChange({
                      ...filters,
                      maxTime:
                        filters.maxTime === time.value ? undefined : time.value,
                    })
                  }
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-3">
            <label className="label-strong flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              Dificultad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((diff) => (
                <Button
                  key={diff.value}
                  variant={filters.difficulty === diff.value ? "default" : "outline"}
                  className={
                    filters.difficulty === diff.value
                      ? "bg-cocorico-red text-white"
                      : "coco-glass"
                  }
                  onClick={() =>
                    onChange({
                      ...filters,
                      difficulty:
                        filters.difficulty === diff.value
                          ? undefined
                          : (diff.value as any),
                    })
                  }
                >
                  {diff.icon} {diff.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <label className="label-strong flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Categoría
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.value}
                  variant={filters.category === cat.value ? "default" : "outline"}
                  className={
                    filters.category === cat.value
                      ? "bg-cocorico-red text-white"
                      : "coco-glass"
                  }
                  onClick={() =>
                    onChange({
                      ...filters,
                      category:
                        filters.category === cat.value ? undefined : cat.value,
                    })
                  }
                >
                  {cat.icon} {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Diet Filter */}
          <div className="space-y-3">
            <label className="label-strong flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Dietas (múltiple)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DIETS.map((diet) => (
                <Button
                  key={diet.value}
                  variant={
                    filters.diet?.includes(diet.value) ? "default" : "outline"
                  }
                  className={
                    filters.diet?.includes(diet.value)
                      ? "bg-cocorico-red text-white"
                      : "coco-glass"
                  }
                  onClick={() => toggleDiet(diet.value)}
                >
                  {diet.icon} {diet.label}
                </Button>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
