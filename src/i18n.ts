import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // Asegurar que siempre retornamos un string válido soportado
  const supportedLocales = ["es", "en"] as const;
  const requested = typeof locale === "string" ? locale : "es";
  const safeLocale: string = supportedLocales.includes(requested as any) ? requested : "es";

  try {
    const messages = (await import(`./messages/${safeLocale}.json`)).default;
    return { locale: safeLocale, messages };
  } catch (err) {
    console.error(`[i18n] load fail for ${safeLocale}`, err);
    const fallbackMessages = (await import("./messages/es.json")).default;
    return { locale: "es", messages: fallbackMessages };
  }
});
