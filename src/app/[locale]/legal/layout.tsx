/**
 * Legal Layout - BLOQUE 1 FIX
 * 
 * CAMBIO: El layout padre [locale]/layout.tsx ya incluye UnifiedNavbar + Footer,
 * por lo que no necesitamos duplicarlos aquí. Solo aplicamos estilos de contenedor.
 * 
 * NOTA: Este layout hereda automáticamente el header y footer del layout padre.
 */

import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Información legal</h1>
        <p className="text-sm text-muted-foreground">
          Aquí encontrarás los términos, la política de privacidad y la política de cookies de Cocorico.
        </p>
      </header>

      <section className="space-y-6">{children}</section>
    </main>
  );
}

