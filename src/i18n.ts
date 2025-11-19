import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // Asegurar que siempre retornamos un string válido soportado
  const supportedLocales = ["es", "en"] as const;
  type SupportedLocale = typeof supportedLocales[number];
  const requested = typeof locale === "string" ? locale : "es";
  const isSupportedLocale = (l: string): l is SupportedLocale =>
    (supportedLocales as readonly string[]).includes(l);
  const safeLocale: SupportedLocale = isSupportedLocale(requested) ? requested : "es";

  try {
    const messages = (await import(`./messages/${safeLocale}.json`)).default;
    return { locale: safeLocale, messages };
  } catch (err) {
    console.error(`[i18n] load fail for ${safeLocale}`, err);
    const fallbackMessages = (await import("./messages/es.json")).default;
    return { locale: "es", messages: fallbackMessages };
  }
});
