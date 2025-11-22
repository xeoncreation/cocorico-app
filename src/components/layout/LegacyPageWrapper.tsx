/**
 * LegacyPageWrapper - BLOQUE 1 FIX
 * 
 * Wrapper para páginas legacy a nivel raíz (/chat, /recipes, etc.)
 * que NO están bajo [locale]/ y por tanto no heredan UnifiedNavbar + Footer.
 * 
 * USO:
 * ```tsx
 * import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";
 * 
 * export default function LegacyPage() {
 *   return (
 *     <LegacyPageWrapper>
 *       <div>Tu contenido aquí</div>
 *     </LegacyPageWrapper>
 *   );
 * }
 * ```
 * 
 * NOTA: Este componente es temporal hasta migrar todas las páginas a [locale]/
 */

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface LegacyPageWrapperProps {
  children: ReactNode;
  /**
   * Si true, añade padding-top para compensar navbar sticky.
   * Default: true
   */
  addTopPadding?: boolean;
  /**
   * Si true, incluye Footer.
   * Default: true
   */
  includeFooter?: boolean;
}

export default function LegacyPageWrapper({
  children,
  addTopPadding = true,
  includeFooter = true,
}: LegacyPageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${addTopPadding ? "pt-[60px]" : ""}`}>
        {children}
      </main>
      {includeFooter && <Footer />}
    </div>
  );
}
