"use client";

import type { NormalizedProduct } from "@/lib/scan/types";
import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import Reveal from "@/components/ui/Reveal";

type Props = {
  product: NormalizedProduct & {
    cocorico_score: number;
  };
};

// Mapa de aditivos peligrosos (simplificado - puedes expandir con más)
const DANGEROUS_ADDITIVES: Record<string, { risk: "high" | "medium" | "low"; name: string }> = {
  "e102": { risk: "high", name: "Tartrazina (colorante amarillo)" },
  "e110": { risk: "high", name: "Amarillo ocaso FCF" },
  "e129": { risk: "high", name: "Rojo allura AC" },
  "e951": { risk: "medium", name: "Aspartamo (edulcorante)" },
  "e621": { risk: "medium", name: "Glutamato monosódico" },
  "e250": { risk: "high", name: "Nitrito de sodio" },
  "e320": { risk: "medium", name: "Butilhidroxianisol (BHA)" },
};

export default function ProductCardYuka({ product }: Props) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const score = product.cocorico_score ?? 0;
  
  // Colores y etiquetas según puntuación
  const getScoreColor = () => {
    if (score >= 80) return { bg: "bg-green-500", text: "text-green-500", label: "Excelente", icon: "🟢" };
    if (score >= 65) return { bg: "bg-yellow-500", text: "text-yellow-500", label: "Bueno", icon: "🟡" };
    if (score >= 45) return { bg: "bg-orange-500", text: "text-orange-500", label: "Mediocre", icon: "🟠" };
    return { bg: "bg-red-500", text: "text-red-500", label: "Malo", icon: "🔴" };
  };

  const scoreColor = getScoreColor();

  // Análisis de aditivos
  const additives = product.additives_tags || [];
  const dangerousAdditives = additives.filter(tag => {
    const code = tag.replace("en:", "").toLowerCase();
    return DANGEROUS_ADDITIVES[code];
  });

  // Nutri-Score visual
  const nutriScoreGrades = ["a", "b", "c", "d", "e"];
  const currentNutriScore = product.nutri_score?.toLowerCase() || null;

  // NOVA Group info
  const novaInfo = {
    1: { label: "Alimentos sin procesar", color: "text-green-600", desc: "Productos naturales" },
    2: { label: "Ingredientes culinarios", color: "text-yellow-600", desc: "Aceites, azúcar, sal" },
    3: { label: "Procesados", color: "text-orange-600", desc: "Con conservantes" },
    4: { label: "Ultraprocesados", color: "text-red-600", desc: "Alto procesamiento industrial" },
  };

  const currentNova = product.nova_group ? novaInfo[product.nova_group as keyof typeof novaInfo] : null;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-4 mt-6">
      {/* Header Card - Puntuación principal */}
      <Reveal>
        <GlassCard className="p-6">
          <div className="flex items-start gap-4">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-28 h-28 rounded-2xl object-cover shadow-lg border-2 border-white/50"
              />
            )}
            <div className="flex-1">
              <h2 className="heading-2 glass-text-strong mb-1">
                {product.name}
              </h2>
              {product.brand && (
                <p className="body-small glass-text-medium mb-2">
                  {product.brand}
                </p>
              )}
              <p className="text-xs glass-text-medium">
                {product.barcode}
              </p>
            </div>
          </div>

          {/* Puntuación Cocorico - Grande y prominente */}
          <div className="mt-6 text-center">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${scoreColor.bg} shadow-2xl`}>
              <div className="text-center">
                <div className="text-5xl font-black text-white">{score}</div>
                <div className="text-sm font-semibold text-white/90">/100</div>
              </div>
            </div>
            <p className={`mt-3 text-xl font-bold ${scoreColor.text}`}>
              {scoreColor.icon} {scoreColor.label}
            </p>
          </div>
        </GlassCard>
      </Reveal>

      {/* Nutri-Score */}
      {currentNutriScore && (
        <Reveal delay={0.1}>
          <GlassCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold glass-text-strong">Nutri-Score</h3>
              <Info className="w-4 h-4 glass-text-medium" />
            </div>
          <div className="flex gap-1">
            {nutriScoreGrades.map((grade) => {
              const isActive = grade === currentNutriScore;
              const colors = {
                a: "bg-green-600",
                b: "bg-lime-500",
                c: "bg-yellow-500",
                d: "bg-orange-500",
                e: "bg-red-600",
              };
              return (
                <div
                  key={grade}
                  className={`flex-1 h-12 rounded-lg flex items-center justify-center font-black text-white uppercase transition-all ${
                    isActive ? `${colors[grade as keyof typeof colors]} scale-110 shadow-lg` : "bg-neutral-300 dark:bg-neutral-700 opacity-40"
                  }`}
                >
                  {grade}
                </div>
              );
            })}
          </div>
        </GlassCard>
        </Reveal>
      )}

      {/* NOVA Group */}
      {currentNova && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold glass-text-strong">Nivel de procesamiento</h3>
              <p className={`text-sm font-semibold ${currentNova.color}`}>
                NOVA {product.nova_group}: {currentNova.label}
              </p>
              <p className="text-xs glass-text-medium mt-1">
                {currentNova.desc}
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl text-white ${
              product.nova_group === 1 ? "bg-green-600" :
              product.nova_group === 2 ? "bg-yellow-600" :
              product.nova_group === 3 ? "bg-orange-600" :
              "bg-red-600"
            }`}>
              {product.nova_group}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Información Nutricional */}
      {product.nutrients && Object.keys(product.nutrients).length > 0 && (
        <GlassCard className="bg-white/70 dark:bg-neutral-900/70">
          <button
            onClick={() => toggleSection("nutrition")}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <h3 className="font-bold text-neutral-900 dark:text-white">Información Nutricional</h3>
            {expandedSection === "nutrition" ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSection === "nutrition" && (
            <div className="px-4 pb-4 space-y-2">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">Por 100g</p>
              {product.nutrients.energy_kcal && (
                <NutrientRow label="Calorías" value={`${product.nutrients.energy_kcal} kcal`} />
              )}
              {product.nutrients.fat !== undefined && (
                <NutrientRow label="Grasas" value={`${product.nutrients.fat?.toFixed(1)} g`} level={product.nutrients.fat > 20 ? "high" : product.nutrients.fat > 10 ? "medium" : "low"} />
              )}
              {product.nutrients.saturated_fat !== undefined && (
                <NutrientRow label="Grasas saturadas" value={`${product.nutrients.saturated_fat?.toFixed(1)} g`} level={product.nutrients.saturated_fat > 5 ? "high" : product.nutrients.saturated_fat > 2 ? "medium" : "low"} indent />
              )}
              {product.nutrients.carbohydrates !== undefined && (
                <NutrientRow label="Carbohidratos" value={`${product.nutrients.carbohydrates?.toFixed(1)} g`} />
              )}
              {product.nutrients.sugars !== undefined && (
                <NutrientRow label="Azúcares" value={`${product.nutrients.sugars?.toFixed(1)} g`} level={product.nutrients.sugars > 15 ? "high" : product.nutrients.sugars > 5 ? "medium" : "low"} indent />
              )}
              {product.nutrients.fiber !== undefined && (
                <NutrientRow label="Fibra" value={`${product.nutrients.fiber?.toFixed(1)} g`} level="good" />
              )}
              {product.nutrients.proteins !== undefined && (
                <NutrientRow label="Proteínas" value={`${product.nutrients.proteins?.toFixed(1)} g`} level="good" />
              )}
              {product.nutrients.salt !== undefined && (
                <NutrientRow label="Sal" value={`${product.nutrients.salt?.toFixed(2)} g`} level={product.nutrients.salt > 1.5 ? "high" : product.nutrients.salt > 0.5 ? "medium" : "low"} />
              )}
            </div>
          )}
        </GlassCard>
      )}

      {/* Aditivos */}
      {additives.length > 0 && (
        <GlassCard className="bg-white/70 dark:bg-neutral-900/70">
          <button
            onClick={() => toggleSection("additives")}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-neutral-900 dark:text-white">Aditivos</h3>
              {dangerousAdditives.length > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {dangerousAdditives.length} ⚠️
                </span>
              )}
            </div>
            {expandedSection === "additives" ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSection === "additives" && (
            <div className="px-4 pb-4 space-y-2">
              {additives.map((additive, idx) => {
                const code = additive.replace("en:", "").toLowerCase();
                const danger = DANGEROUS_ADDITIVES[code];
                return (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {danger ? (
                      danger.risk === "high" ? <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /> :
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-neutral-900 dark:text-white uppercase">
                        {code}
                      </p>
                      {danger && (
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">{danger.name}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      )}

      {/* Alérgenos */}
      {product.allergens_tags && product.allergens_tags.length > 0 && (
        <GlassCard className="p-4 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-orange-900 dark:text-orange-200 mb-2">Alérgenos</h3>
              <div className="flex flex-wrap gap-2">
                {product.allergens_tags.map((allergen, idx) => (
                  <span key={idx} className="px-3 py-1 bg-orange-200 dark:bg-orange-900 text-orange-900 dark:text-orange-200 text-xs font-semibold rounded-full">
                    {allergen.replace("en:", "").replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Ingredientes */}
      {product.ingredients_text && (
        <GlassCard className="bg-white/70 dark:bg-neutral-900/70">
          <button
            onClick={() => toggleSection("ingredients")}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <h3 className="font-bold text-neutral-900 dark:text-white">Ingredientes</h3>
            {expandedSection === "ingredients" ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSection === "ingredients" && (
            <div className="px-4 pb-4">
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {product.ingredients_text}
              </p>
            </div>
          )}
        </GlassCard>
      )}

      {/* Labels/Certificaciones */}
      {product.labels_tags && product.labels_tags.length > 0 && (
        <GlassCard className="p-4 bg-white/70 dark:bg-neutral-900/70">
          <h3 className="font-bold text-neutral-900 dark:text-white mb-3">Certificaciones</h3>
          <div className="flex flex-wrap gap-2">
            {product.labels_tags.slice(0, 6).map((label, idx) => (
              <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {label.replace("en:", "").replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

// Componente auxiliar para filas de nutrientes
function NutrientRow({ label, value, level, indent }: { label: string; value: string; level?: "low" | "medium" | "high" | "good"; indent?: boolean }) {
  const levelColors = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-red-600",
    good: "text-blue-600",
  };

  const levelIcons = {
    low: "🟢",
    medium: "🟡",
    high: "🔴",
    good: "💚",
  };

  return (
    <div className={`flex items-center justify-between py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0 ${indent ? "pl-4" : ""}`}>
      <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-neutral-900 dark:text-white">{value}</span>
        {level && (
          <span className="text-xs">{levelIcons[level]}</span>
        )}
      </div>
    </div>
  );
}
