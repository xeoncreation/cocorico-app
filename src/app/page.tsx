import { redirect } from "next/navigation";

// Página raíz mínima: delega al middleware para i18n y password.
// Si el middleware falla, hacemos un fallback seguro hacia /es.
export default function RootPage() {
  try {
    // Middleware debe redirigir; si no, fallback manual.
    redirect("/es");
  } catch (err) {
    console.warn("[root] redirect fallback error", err);
    redirect("/es");
  }
  return null;
}
