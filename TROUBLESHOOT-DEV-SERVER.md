## Guía rápida: Dev server se cierra tras "Ready"

Este documento resume los pasos de diagnóstico y corrección cuando `npm run dev` imprime `✓ Ready` pero el puerto 3000 no queda en LISTENING.

### 0. Síntoma
`next dev` muestra banner y mensaje Ready. Al instante el proceso Node desaparece. `curl http://localhost:3000` falla, `netstat` no muestra LISTENING.

Probables causas: incompatibilidad Node (v22), plugin PWA, acceso a `process.exit()`, variables de entorno faltantes, configuración en `next.config.mjs` que aborta.

---
### 1. Usar Node 20.x LTS
Verifica versión:
```powershell
node -v
```
Si es v22.x:
```powershell
nvm install 20.11.1
nvm use 20.11.1
node -v  # Debe mostrar v20.11.1 (o similar 20.x)
```
Node 20 elimina incompatibilidades que pueden cerrar procesos en plugins.

---
### 2. Desactivar PWA temporalmente
Renombra `next.config.mjs` a `next.config.mjs.bak` y crea un `next.config.js` mínimo:
```js
/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true };
module.exports = nextConfig;
```
Corre `npm run dev`. Si ahora se mantiene vivo → el problema está en la config original (PWA / composición de plugins).

---
### 3. Asegurar `.env.local`
Valores faltantes pueden causar throws temprano. Añade mínimos:
```
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy
ADMIN_SECRET=dummy_admin
LOG_LEVEL=info
```
Relanza dev.

---
### 4. Aislar sección conflictiva de `next.config.mjs`
Restaura el archivo original, comenta el wrapper PWA y deja solo:
```js
export default { reactStrictMode: true };
```
Reintroduce plugins uno a uno (intl, pwa, etc.). Después de cada cambio: `npm run dev`. Identifica en qué punto muere.

---
### 5. Obtener traza de salida
```powershell
node --trace-exit node_modules/next/dist/bin/next dev
```
La traza mostrará el módulo que ejecuta `process.exit()`. Revisa dependencias recientes o inicializaciones síncronas.

---
### 6. Verificar Health y LISTENING
Cuando quede estable:
```powershell
curl http://localhost:3000/health
netstat -ano | findstr 3000
```
Debe verse JSON de health y una línea LISTENING con el PID.

---
### 7. Modo inspección
Para detener el cierre y depurar:
```powershell
node --inspect-brk node_modules/next/dist/bin/next dev
```
Abre `chrome://inspect` y adjunta al proceso para ver stack frames antes de la salida.

---
### 8. Checklist rápido
- [ ] Node versión 20.x
- [ ] `.env.local` con mínimos
- [ ] Dev corre sin PWA
- [ ] Plugin conflictivo identificado / reparado
- [ ] `/health` responde 200
- [ ] Puerto 3000 LISTENING
- [ ] Sin cierres al guardar archivos

---
### 9. Acciones adicionales recomendadas
1. Añadir script `"dev:trace": "node --trace-exit node_modules/next/dist/bin/next dev"` en `package.json`.
2. Activar logging defensivo alrededor de inicializaciones críticas (por ejemplo, wrappers PWA/intl) para trazar exceptions.
3. Usar `try/catch` en cualquier configuración que derive valores de `process.env` y loggear claramente en lugar de abortar.

---
### 10. Si persiste
Prueba: eliminar temporalmente dependencias sospechosas (`next-pwa`, herramientas de analítica) y reinstalar `node_modules`:
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```
Luego vuelve a sumar dependencias una por una.

---
Mantén este fichero actualizado si emergen nuevas causas o soluciones.
