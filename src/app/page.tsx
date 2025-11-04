import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootPage() {
  // El middleware se encargará de la redirección,
  // pero por seguridad agregamos redirección a /es si llegan aquí
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  
  // Detectar si el navegador prefiere inglés
  const preferredLocale = acceptLanguage.toLowerCase().startsWith("en") ? "en" : "es";
  
  redirect(`/${preferredLocale}`);
}
