/**
 * Community Layout - BLOQUE 1 FIX
 * 
 * CAMBIO: Eliminado layout personalizado. Community ahora usa el layout 
 * global de [locale]/layout.tsx que ya incluye UnifiedNavbar + Footer.
 * 
 * Este archivo ya no es necesario pero se mantiene como referencia.
 * Considera eliminarlo si no hay estilos específicos necesarios.
 */

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  // Solo pasa los children - el layout padre [locale] ya tiene nav+footer
  return <>{children}</>;
}
