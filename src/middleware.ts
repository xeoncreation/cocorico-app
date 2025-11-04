import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Lista de idiomas soportados
  locales: ['es', 'en'],
  
  // Idioma por defecto si no se detecta ninguno
  defaultLocale: 'es',
  
  // Detectar automáticamente el locale del navegador
  localeDetection: true,
  
  // Prefijo de ruta para los locales
  localePrefix: 'always' // /es/... o /en/...
});

export const config = {
  // Rutas donde aplica el middleware
  // Excluye api, _next/static, _next/image, favicon.ico y archivos de public
  matcher: ['/((?!api|_next|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
