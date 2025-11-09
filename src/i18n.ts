import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async ({locale}) => {
  // Validar locale soportado
  const supported = ['es', 'en'] as const;
  const safeLocale = (supported as readonly string[]).includes(locale as any) ? locale : "es";
  
  try {
    const messages = (await import(`./messages/${safeLocale}.json`)).default;
    return {locale: safeLocale, messages};
  } catch (e) {
    console.error(`[i18n] Failed to load messages for locale: ${safeLocale}`, e);
    const messages = (await import("./messages/es.json")).default;
    return {locale: "es", messages};
  }
});
