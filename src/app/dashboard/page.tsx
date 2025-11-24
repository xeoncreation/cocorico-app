

"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import XpHud from "@/components/dashboard/XpHud";
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";
import Wallpaper from "@/components/layout/Wallpaper";

export default function DashboardPage() {
  // TODO: Integrar lógica real de recetas y usuario
  const recipes: any[] = [];
  return (
    <>
      <Wallpaper
        imageLight="/branding/MIS_RECETAS_MODO_CLARO.jpg"
        imageDark="/branding/MIS_RECETAS_MODO_OSCURO.jpg"
      />
      <LegacyPageWrapper>
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          <h1 className="text-2xl font-bold text-amber-800 glass-text-strong">
            🐓 Mis recetas ({recipes.length})
          </h1>
          {/* XP HUD */}
          <XpHud />
          <div className="flex justify-between">
            <Link
              href="/dashboard/stats"
              className="px-3 py-2 border rounded text-sm text-amber-700 hover:bg-amber-50"
            >
              Ver estadísticas 📊
            </Link>
            <div className="flex gap-2">
              <Link
                href="/dashboard/lab"
                className="px-3 py-2 border rounded text-sm text-amber-700 hover:bg-amber-50"
              >
                🧪 Laboratorio IA
              </Link>
              <Link
                href="/dashboard/new"
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
              >
                + Nueva receta
              </Link>
            </div>
          </div>
          {/* ...más contenido y lógica de recetas... */}
        </main>
      </LegacyPageWrapper>
    </>
  );
