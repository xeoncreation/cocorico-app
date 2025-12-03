// src/app/[locale]/plans/plans-client.tsx
"use client";

import { RippleButton } from "@/components/ui/ripple-button";
import Link from "next/link";

const featuresFree = [
  "Guardar recetas ilimitadas",
  "Escanear ingredientes",
  "Favoritos",
  "Filtros básicos",
];

const featuresPremium = [
  "Liquid Glass UI completa",
  "Filtrado avanzado + IA",
  "Reescritura de recetas",
  "Vídeos HD en todas las páginas",
  "Sugerencias nutricionales IA",
  "Importación avanzada",
];

export default function PlansClient() {
  return (
    <div className="p-6 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="heading-display text-primary">Planes Cocorico</h1>
        <p className="body-regular opacity-70">Explora todo lo que puedes hacer</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* FREE */}
        <div className="glass-card glass-card-orange glass-frosted-border p-6">
          <h2 className="heading-2">Free</h2>
          <p className="opacity-70 mb-6">Perfecto para empezar</p>

          <ul className="space-y-3">
            {featuresFree.map((f) => (
              <li key={f} className="flex items-center gap-2">
                ✔ <span>{f}</span>
              </li>
            ))}
          </ul>

          <RippleButton className="w-full bg-primary text-white mt-6">
            Seguir gratis
          </RippleButton>
        </div>

        {/* PREMIUM */}
        <div className="glass-card glass-card-purple glass-frosted-border p-6">
          <h2 className="heading-2">Premium</h2>
          <p className="body-regular opacity-70 mb-6">Experiencia completa</p>

          <ul className="space-y-3">
            {featuresPremium.map((f) => (
              <li key={f} className="flex items-center gap-2">
                ✨ <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link href="/upgrade">
            <RippleButton className="w-full bg-primary text-white mt-6">
              Mejorar a Premium
            </RippleButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
