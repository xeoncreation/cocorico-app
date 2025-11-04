# Cómo arrancar Cocorico en localhost:3000

## ✅ Cambios aplicados
- **Selector de idiomas**: Ahora visible en el navbar (ES/EN con banderas)
- **i18n**: Configurado correctamente con next-intl
- **APIs**: Protegidas contra configuración faltante de Supabase
- **Tests**: Unit tests (12/12 ✓) y E2E (2/2 ✓) pasando

## 🚀 Para arrancar el servidor

### Opción 1: Desarrollo (recomendado)
Abre PowerShell en `C:\Users\yo-90\cocorico` y ejecuta:

```powershell
npm run dev
```

Luego abre en tu navegador: **http://localhost:3000**

### Opción 2: Si localhost:3000 falla
Prueba estas alternativas:

```powershell
# Usar 127.0.0.1 explícitamente
npm run dev:127

# Cambiar al puerto 3001
npm run dev:3001

# Escuchar en todas las interfaces
npm run dev:all
```

### Opción 3: Modo producción (más estable)
Si el modo dev sigue fallando:

```powershell
npm run build
npm run start
```

## 🔍 Verificación rápida

1. **Comprobar que está escuchando**:
```powershell
netstat -ano | findstr ":3000.*LISTENING"
```
Deberías ver una línea con LISTENING y un PID.

2. **Probar con curl**:
```powershell
curl.exe http://localhost:3000/health
```
Debería devolver: `{"status":"ok","time":"..."}`

3. **Abrir en navegador**:
- Home: http://localhost:3000/
- Chat: http://localhost:3000/chat
- Stats: http://localhost:3000/dashboard/stats
- Health: http://localhost:3000/health

## ⚠️ Si sigue sin funcionar

### 1. Firewall/Antivirus
Permite Node.js en el firewall de Windows:

```powershell
# Ejecutar como Administrador
netsh advfirewall firewall add rule name="Allow Node.js 3000" dir=in action=allow protocol=TCP localport=3000
```

### 2. Proxy/VPN
- Desactiva VPNs temporalmente
- Ve a Ajustes → Red e Internet → Proxy y desactiva cualquier proxy

### 3. Archivo hosts
Verifica que en `C:\Windows\System32\drivers\etc\hosts` exista:
```
127.0.0.1 localhost
```

### 4. Limpieza completa
Si has tenido muchos intentos fallidos:

```powershell
# Matar procesos Node
taskkill /F /IM node.exe

# Limpiar caché
npm run clean

# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm ci

# Arrancar de nuevo
npm run dev
```

## 🧪 Tests disponibles

```powershell
# Tests unitarios
npm test

# Tests E2E (arranca servidor de producción automáticamente)
npm run test:e2e:prod
```

## 📌 Características nuevas visibles

1. **Selector de idiomas**: Botón "ES 🇪🇸" en el navbar (esquina superior derecha)
   - Click para cambiar entre Español e Inglés
   - Funciona con búsqueda por texto
   - Preserva la ruta actual al cambiar de idioma

2. **Menú de usuario**: Si inicias sesión verás tu email y "Cerrar sesión"

3. **Tema oscuro/claro**: Botón junto al selector de idiomas

## 🎯 Rutas principales

- `/` - Página de inicio
- `/chat` - Chat con Cocorico
- `/es/chat` - Chat en español (localizado)
- `/en/chat` - Chat en inglés (localizado)
- `/dashboard/favorites` - Recetas favoritas (requiere login)
- `/dashboard/stats` - Estadísticas
- `/login` - Iniciar sesión
- `/signup` - Registro

## ℹ️ Notas técnicas

- Node v22.20.0 detectado ✓
- Next.js 14.0.3 ✓
- Build exitoso ✓
- TypeScript sin errores ✓

Los warnings sobre "Dynamic server usage" son normales porque las APIs usan cookies para autenticación.
