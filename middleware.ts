import createMiddleware from "next-intl/middleware";

// Middleware de i18n con next-intl (reactiva el matcher estándar)
export default createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
});

export const config = {
  // Excluye API, assets, _next y archivos con extensión
  // También excluimos /health para que no requiera prefijo de locale
  matcher: ["/((?!api|_next|static|health|.*\\..*).*)"],
};
