# ❓ PREGUNTAS FRECUENTES Y SOLUCIÓN DE PROBLEMAS

---

## 🔥 FIREBASE

### P: ¿Por qué necesito Firebase si ya tengo Supabase?
**R:**
Firebase es solo para las **notificaciones push** (esos mensajes que aparecen en tu navegador o móvil). Supabase no tiene esta función nativa. Firebase y Supabase funcionan juntos sin problemas.

### P: ¿Firebase es gratis?
**R:**
Sí, el plan gratuito (Spark) incluye:
- Cloud Messaging ilimitado
- Hasta 10GB de almacenamiento (que no usarás)
- Hasta 50,000 llamadas diarias (más que suficiente)

### P: No veo el botón "Generar par de claves" en Cloud Messaging
**R:** Asegúrate de:
1. Estar en la pestaña **"Cloud Messaging"** (no "General")
2. Bajar hasta la sección **"Configuración web"**
3. Si no aparece, recarga la página (F5)
4. Si sigue sin aparecer, cierra sesión y vuelve a entrar

### P: No puedo habilitar "Cloud Messaging API (Legacy)"
**R:**
1. Cuando hagas clic en "Manage API in Google Cloud Console", espera a que se abra la nueva pestaña
2. Busca el botón azul **"ENABLE"** o **"HABILITAR"**
3. Haz clic y espera 10-30 segundos
4. Vuelve a Firebase y **recarga la página** (F5)
5. Ahora debería aparecer "Habilitado" y podrás ver la Server Key

### P: ¿Qué pasa si me equivoco al copiar una credencial?
**R:** Puedes volver a Firebase Console en cualquier momento:
- **firebaseConfig**: Configuración del proyecto → General → Tus aplicaciones → (tu app web)
- **VAPID Key**: Configuración del proyecto → Cloud Messaging → Configuración web
- **Server Key**: Configuración del proyecto → Cloud Messaging → arriba del todo

### P: ¿Es seguro poner las claves de Firebase en .env.local?
**R:** Sí, porque:
1. El archivo `.env.local` **NO se sube a Git** (está en `.gitignore`)
2. Las claves que empiezan con `NEXT_PUBLIC_` son públicas (van al navegador), están diseñadas para eso
3. La `FIREBASE_SERVER_KEY` **NO** tiene `NEXT_PUBLIC_`, solo se usa en el servidor

---

## 📊 GOOGLE ANALYTICS

### P: ¿Por qué necesito Google Analytics?
**R:** Para saber:
- Cuántas personas visitan tu web
- Qué páginas son más populares
- Desde qué países te visitan
- Cuánto tiempo pasan en cada página
- Si vienen desde Google, redes sociales, etc.

### P: ¿Google Analytics es gratis?
**R:** Sí, totalmente gratis y sin límites para sitios web normales.

### P: ¿GA4 es lo mismo que Google Analytics?
**R:** GA4 es la **nueva versión** de Google Analytics (lanzada en 2020). Es la única que debes usar ahora. La versión antigua (Universal Analytics) dejó de funcionar en julio 2023.

### P: No veo datos en Google Analytics
**R:**
Es normal. Los datos pueden tardar:
- **24-48 horas** en aparecer por primera vez
- Puedes ver datos en tiempo real en: Analytics → Informes → Tiempo real

### P: ¿Tengo que hacer algo más después de copiar el ID de medición?
**R:** No, con pegar el `G-XXXXXXXXXX` en `.env.local` es suficiente. El código ya está integrado en tu app.

---

## 🎨 ICONOS PWA

### P: ¿Qué es PWA?
**R:** Progressive Web App = una web que se puede "instalar" en el móvil como si fuera una app nativa. Aparece en la pantalla de inicio y puede funcionar offline.

### P: Mi logo no es cuadrado, ¿qué hago?
**R:**
**Opción 1 - Paint (Windows):**
1. Abre Paint
2. Archivo → Nuevo → Cambiar tamaño de lienzo
3. Píxeles: 512 x 512
4. Marca "Mantener relación de aspecto": **NO**
5. Pega tu logo en el centro
6. Guarda como PNG

**Opción 2 - Figma/Canva (online):**
1. Crea un diseño de 512x512px
2. Sube tu logo
3. Centra y ajusta el tamaño
4. Exporta como PNG

### P: ¿Qué pasa si no tengo logo todavía?
**R:** Puedes usar uno temporal:
1. Genera uno con IA: https://logoai.com/ o https://looka.com/
2. Usa un emoji gigante: https://emojipedia.org/ → copia un emoji → pégalo en Paint → guarda
3. Usa texto: Crea una imagen de 512x512 con fondo de color y las letras "CC" grandes

### P: Los iconos se ven pixelados
**R:** Tu logo original es muy pequeño. Necesitas:
- **Mínimo**: 512x512 píxeles
- **Recomendado**: 1024x1024 píxeles o más
- Formato: PNG con transparencia

### P: ¿Por qué necesito 3 iconos diferentes (192, 512, apple)?

**R:**

- `icon-192.png`: Para Android cuando instalas la PWA
- `icon-512.png`: Para pantallas de alta resolución y splash screen
- `apple-icon.png`: Para iPhone/iPad (Apple usa un formato diferente)

---

## 💻 ARCHIVO .env.local

### P: ¿Dónde está el archivo .env.local?
**R:** En la **raíz** de tu proyecto, al mismo nivel que `package.json`:
```
c:\Users\yo-90\cocorico\.env.local
```

Si no existe, créalo:
1. Clic derecho en la carpeta raíz en VS Code
2. Nuevo archivo
3. Nombre: `.env.local` (con el punto al inicio)

### P: No veo el archivo .env.local en VS Code
**R:** Puede que esté oculto. Presiona:
1. `Ctrl + P` (abrir archivo rápido)
2. Escribe `.env.local`
3. Si aparece, haz clic para abrirlo
4. Si no aparece, créalo nuevo

### P: ¿Puedo subir .env.local a GitHub?
**R:** **¡NO!** Este archivo contiene claves secretas. Ya está en `.gitignore` para evitarlo. Solo sube `.env.example` (que no tiene valores reales).

### P: ¿Qué diferencia hay entre .env.local y .env.example?
**R:**
- `.env.example`: Plantilla con nombres de variables (se sube a Git)
- `.env.local`: Valores reales (NO se sube a Git, es privado)

### P: He cambiado .env.local pero no funciona
**R:** Debes **reiniciar el servidor**:
1. Ve a la terminal de VS Code
2. Presiona `Ctrl + C` (detener servidor)
3. Espera 2 segundos
4. `npm run dev` (iniciar de nuevo)

**Importante:** Los cambios en `.env.local` NO se recargan automáticamente.

---

## 🚨 ERRORES COMUNES

### Error: "firebase is not defined"
**Causa:** Faltan las credenciales de Firebase en `.env.local`

**Solución:**
1. Abre `.env.local`
2. Verifica que TODAS las líneas de Firebase tengan valores (no "PEGA_AQUI_TU_...")
3. Guarda el archivo (Ctrl + S)
4. Reinicia el servidor (`Ctrl + C` → `npm run dev`)

---

### Error: "Invalid Firebase configuration"
**Causa:** Copiaste mal alguna credencial de Firebase

**Solución:**
1. Ve a Firebase Console
2. Configuración del proyecto → General → Tus aplicaciones
3. Busca tu app web "Cocorico Web"
4. Compara los valores del `firebaseConfig` con tu `.env.local`
5. Copia de nuevo los que estén mal

---

### Error: "VAPID key is required"
**Causa:** No copiaste la clave VAPID o está vacía

**Solución:**
1. Ve a Firebase Console
2. Configuración del proyecto → Cloud Messaging
3. Baja a "Configuración web"
4. Copia la clave (la que empieza con `BK...` o similar)
5. Pégala en `NEXT_PUBLIC_FIREBASE_VAPID_KEY=` en `.env.local`

---

### Error: "Notification permission denied"
**Causa:** Bloqueaste las notificaciones en el navegador

**Solución:**
1. Haz clic en el **candado** 🔒 al lado de la URL (http://localhost:3000)
2. Busca **"Notificaciones"**
3. Cambia a **"Permitir"**
4. Recarga la página (F5)

---

### Error: "GA_MEASUREMENT_ID is not defined"
**Causa:** No configuraste Google Analytics

**Solución:**
1. Ve a https://analytics.google.com/
2. Crea tu propiedad (sigue la GUÍA_CONFIGURACION.md)
3. Copia el ID de medición (G-XXXXXXXXXX)
4. Pégalo en `NEXT_PUBLIC_GA_ID=` en `.env.local`
5. Reinicia el servidor

**Nota:** Si no quieres Analytics ahora, puedes dejar esta línea vacía. La app funcionará igual.

---

### Error: "Cannot find module 'firebase'"
**Causa:** No se instaló Firebase correctamente

**Solución:**
```powershell
npm install firebase
```

Si sigue sin funcionar:
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

---

### Error: Los iconos PWA no aparecen
**Causa:** Los archivos están en la ubicación incorrecta o con nombres incorrectos

**Solución:**
1. Abre el explorador de archivos: `c:\Users\yo-90\cocorico\public\`
2. Verifica que existen estos archivos **exactamente así**:
   - `icon-192.png`
   - `icon-512.png`
   - `apple-icon.png`
3. Si tienen otros nombres, renómbralos
4. Si no existen, genera los iconos de nuevo (ve a GUÍA_CONFIGURACION.md → PARTE 3)

---

### Error: "Port 3000 is already in use"
**Causa:** Ya hay un servidor corriendo en el puerto 3000

**Solución:**
```powershell
npx kill-port 3000
npm run dev
```

O cierra todos los procesos de Node:
```powershell
taskkill /F /IM node.exe
npm run dev
```

---

## 🧪 CÓMO PROBAR QUE TODO FUNCIONA

### ✅ Probar Firebase (Notificaciones)

1. Inicia el servidor: `npm run dev`
2. Abre `http://localhost:3000` en Chrome o Edge
3. **Espera 5 segundos**
4. Debería aparecer un modal pidiendo permiso para notificaciones
5. Haz clic en **"Aceptar"**
6. Si ves "Notificaciones activadas" → ✅ Funciona

**No aparece el modal:**
- Abre la consola del navegador (F12 → Console)
- Busca errores en rojo relacionados con "firebase"
- Verifica que todas las variables de Firebase en `.env.local` tienen valores

---

### ✅ Probar Google Analytics

**Opción 1 - Tiempo real:**
1. Abre https://analytics.google.com/
2. Ve a tu propiedad "Cocorico App"
3. Informes → Tiempo real
4. En otra pestaña, abre `http://localhost:3000`
5. Navega por tu sitio
6. En 10-30 segundos deberías verte en "Tiempo real"

**Opción 2 - Extensión de Chrome:**
1. Instala: https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna
2. Activa la extensión (ícono azul en la barra)
3. Abre `http://localhost:3000`
4. Presiona F12 → Console
5. Deberías ver mensajes de "Google Analytics" enviando eventos

---

### ✅ Probar Iconos PWA

1. Inicia el servidor: `npm run dev`
2. Abre `http://localhost:3000/manifest.webmanifest`
3. Deberías ver un JSON con:
```json
{
  "icons": [
    {
      "src": "/icon-192.png",
      ...
    }
  ]
}
```
4. Abre `http://localhost:3000/icon-192.png`
5. Deberías ver tu logo (si da error 404 → los iconos no están)

---

### ✅ Probar Dashboard de Analytics (Admin)

1. Asegúrate de haber configurado `ADMIN_EMAIL` en `.env.local`
2. Inicia sesión en tu app con ese email
3. Ve a `http://localhost:3000/admin/analytics`
4. Deberías ver gráficos con datos (pueden estar vacíos si no hay uso aún)
5. Si ves "Acceso denegado" → tu email no coincide con `ADMIN_EMAIL`

---

## 📞 ¿SIGUES ATASCADO?

Si después de leer todo esto sigues con problemas:

1. **Abre la consola del navegador** (F12 → Console)
2. **Copia el error completo** (clic derecho → Copy → Copy all)
3. **Dime en qué paso estás** (ej: "Paso 1.6 - Obtener VAPID key")
4. **Envíame el error** que copiaste

Y te ayudaré a solucionarlo. 🚀

---

## 💡 CONSEJOS PRO

### Organiza tus credenciales
Crea un documento privado (Google Docs, OneNote, etc.) con:
- URL de Firebase Console
- URL de Google Analytics
- Todas tus claves (por si borras .env.local sin querer)

### Usa variables de entorno en Vercel
Cuando subas a producción, configura las mismas variables en Vercel:
1. Proyecto → Settings → Environment Variables
2. Copia cada línea de `.env.local`
3. Pega nombre y valor

### Revisa Analytics cada semana
Configura un recordatorio para revisar:
- Usuarios activos
- Páginas más visitadas
- Tasa de rebote
- Tiempo de permanencia

### Prueba las notificaciones push
Envía notificaciones de prueba desde Firebase:
1. Firebase Console → Cloud Messaging
2. "Send your first message"
3. Escribe un mensaje y envíalo a tu app

---

**Última actualización:** Noviembre 2025
**Versión de las guías:** 1.0
