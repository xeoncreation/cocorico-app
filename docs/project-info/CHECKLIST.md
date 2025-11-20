# ✅ CHECKLIST DE CONFIGURACIÓN - MARCA CADA PASO

Imprime esta página o mantenla abierta mientras configuras. Marca cada casilla cuando completes el paso.

---

## 🔥 PARTE 1: FIREBASE (15 minutos)

### Crear proyecto

- [ ] He abierto https://console.firebase.google.com/
- [ ] He iniciado sesión con mi cuenta de Google
- [ ] He hecho clic en "Agregar proyecto"
- [ ] He escrito el nombre: `cocorico-notifications`
- [ ] He desactivado Google Analytics (no es necesario aquí)
- [ ] He hecho clic en "Crear proyecto"
- [ ] El proyecto se ha creado correctamente (dice "Tu proyecto está listo")

### Registrar app web

- [ ] He hecho clic en el ícono **`</>`** (Web)
- [ ] He escrito el nombre: `Cocorico Web`
- [ ] NO he marcado "También configurar Firebase Hosting"
- [ ] He hecho clic en "Registrar app"

### Copiar firebaseConfig

- [ ] He visto el código con `const firebaseConfig = {`
- [ ] He abierto el bloc de notas de Windows
- [ ] He copiado TODO el objeto firebaseConfig
- [ ] He pegado en el bloc de notas
- [ ] He guardado como `firebase-credentials.txt` en mi escritorio
- [ ] He hecho clic en "Continuar a la consola"

### Habilitar Cloud Messaging

- [ ] He encontrado "Compilación" o "Build" en el menú lateral
- [ ] He hecho clic en "Cloud Messaging"
- [ ] He activado el servicio (si me lo pidió)

### Generar clave VAPID

- [ ] He hecho clic en el engranaje ⚙️ (arriba a la izquierda)
- [ ] He seleccionado "Configuración del proyecto"
- [ ] He hecho clic en la pestaña "Cloud Messaging"
- [ ] He bajado hasta "Configuración web"
- [ ] He hecho clic en "Generar par de claves"
- [ ] He visto la clave (empieza con letras/números como `BK3x...`)
- [ ] He copiado la clave VAPID
- [ ] La he pegado en mi bloc de notas con la etiqueta "VAPID_KEY:"

### Habilitar Cloud Messaging API (Legacy)

- [ ] En la misma página, arriba, he encontrado "Cloud Messaging API (Legacy)"
- [ ] He visto que dice "Deshabilitado"
- [ ] He hecho clic en el menú de 3 puntos ⋮
- [ ] He seleccionado "Manage API in Google Cloud Console"
- [ ] Se ha abierto una nueva pestaña de Google Cloud
- [ ] He hecho clic en "ENABLE" o "HABILITAR"
- [ ] He esperado 10-20 segundos
- [ ] He vuelto a la pestaña de Firebase
- [ ] He recargado la página (F5)

### Copiar Server Key

- [ ] Ahora veo "Cloud Messaging API (Legacy): Habilitado"
- [ ] Veo la "Server key" con un candado 🔒
- [ ] He copiado la Server Key (empieza con `AAAA...` o similar)
- [ ] La he pegado en mi bloc de notas con la etiqueta "SERVER_KEY:"

### Transferir a .env.local

- [ ] He abierto VS Code
- [ ] He abierto el archivo `.env.local` en la raíz del proyecto
- [ ] He abierto mi `firebase-credentials.txt`
- [ ] He pegado `apiKey` en `NEXT_PUBLIC_FIREBASE_API_KEY=`
- [ ] He pegado `authDomain` en `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=`
- [ ] He pegado `projectId` en `NEXT_PUBLIC_FIREBASE_PROJECT_ID=`
- [ ] He pegado `storageBucket` en `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=`
- [ ] He pegado `messagingSenderId` en `NEXT_PUBLIC_FIREBASE_SENDER_ID=`
- [ ] He pegado `appId` en `NEXT_PUBLIC_FIREBASE_APP_ID=`
- [ ] He pegado VAPID_KEY en `NEXT_PUBLIC_FIREBASE_VAPID_KEY=`
- [ ] He pegado SERVER_KEY en `FIREBASE_SERVER_KEY=`
- [ ] He guardado `.env.local` (Ctrl + S)

**✅ Firebase completado: [ ]** (marca cuando todo esté listo)

---

## 📊 PARTE 2: GOOGLE ANALYTICS (10 minutos)

### Crear cuenta

- [ ] He abierto https://analytics.google.com/
- [ ] He iniciado sesión con mi cuenta de Google
- [ ] He hecho clic en "Empezar a medir" (si es mi primera vez)

### Configurar cuenta

- [ ] He escrito el nombre de la cuenta: `Cocorico`
- [ ] He revisado las opciones de compartir datos (opcional)
- [ ] He hecho clic en "Siguiente"

### Crear propiedad

- [ ] He escrito el nombre de la propiedad: `Cocorico App`
- [ ] He seleccionado mi zona horaria
- [ ] He seleccionado mi moneda
- [ ] He hecho clic en "Siguiente"

### Información del negocio

- [ ] He seleccionado el sector (ej: Alimentación y bebidas)
- [ ] He seleccionado el tamaño de empresa
- [ ] He hecho clic en "Siguiente"
- [ ] He marcado objetivos empresariales (opcionales)
- [ ] He hecho clic en "Crear"
- [ ] He aceptado los términos de servicio

### Configurar flujo de datos web

- [ ] He seleccionado la plataforma "Web"
- [ ] He escrito la URL: `https://cocorico.app` (o `http://localhost:3000`)
- [ ] He escrito el nombre del flujo: `Cocorico Web`
- [ ] He dejado marcado "Medición mejorada"
- [ ] He hecho clic en "Crear flujo"

### Copiar Measurement ID

- [ ] He visto "Detalles del flujo web"
- [ ] He encontrado "ID DE MEDICIÓN" arriba a la derecha
- [ ] He visto el código que empieza con `G-` (ej: `G-ABCD123456`)
- [ ] He copiado el ID completo (con el `G-`)
- [ ] He abierto `.env.local` en VS Code
- [ ] He pegado en `NEXT_PUBLIC_GA_ID=`
- [ ] He guardado `.env.local` (Ctrl + S)

**✅ Google Analytics completado: [ ]** (marca cuando todo esté listo)

---

## 🎨 PARTE 3: ICONOS PWA (5 minutos)

### Preparar logo

- [ ] Tengo un logo de Cocorico
- [ ] El logo es PNG
- [ ] El logo es cuadrado (mismo ancho que alto)
- [ ] El logo tiene mínimo 512x512 píxeles
- [ ] Si no era cuadrado, lo he hecho cuadrado con Paint

### Generar iconos online

- [ ] He abierto https://realfavicongenerator.net/
- [ ] He hecho clic en "Select your Favicon image"
- [ ] He seleccionado mi logo PNG
- [ ] He esperado a que se suba
- [ ] He visto la previsualización en diferentes plataformas
- [ ] He bajado hasta el final de la página
- [ ] He hecho clic en "Generate your Favicons and HTML code"
- [ ] He esperado 5-10 segundos
- [ ] He hecho clic en "Favicon package"
- [ ] Se ha descargado un archivo ZIP

### Copiar iconos al proyecto

- [ ] He abierto el archivo ZIP descargado
- [ ] He abierto otra ventana del explorador de archivos
- [ ] He navegado a `C:\Users\yo-90\cocorico\public\`
- [ ] He copiado `android-chrome-192x192.png` del ZIP a `public/`
- [ ] He renombrado como `icon-192.png`
- [ ] He copiado `android-chrome-512x512.png` del ZIP a `public/`
- [ ] He renombrado como `icon-512.png`
- [ ] He copiado `apple-touch-icon.png` del ZIP a `public/`
- [ ] He renombrado como `apple-icon.png`

### Verificar

- [ ] En VS Code, veo `public/icon-192.png`
- [ ] En VS Code, veo `public/icon-512.png`
- [ ] En VS Code, veo `public/apple-icon.png`

**✅ Iconos PWA completados: [ ]** (marca cuando todo esté listo)

---

## 👤 PARTE 4: EMAIL DE ADMIN (1 minuto)

- [ ] He abierto `.env.local` en VS Code
- [ ] He encontrado la línea `ADMIN_EMAIL=`
- [ ] He escrito mi email (el que uso para iniciar sesión en Cocorico)
- [ ] He guardado `.env.local` (Ctrl + S)

**✅ Email de admin completado: [ ]** (marca cuando todo esté listo)

---

## 🧪 PARTE 5: VERIFICACIÓN FINAL

### Verificar .env.local

- [ ] He abierto `.env.local` en VS Code
- [ ] NO veo ninguna línea con "PEGA_AQUI_TU_..."
- [ ] Todas las líneas de Firebase tienen valores
- [ ] `NEXT_PUBLIC_GA_ID=` tiene un valor que empieza con `G-`
- [ ] `ADMIN_EMAIL=` tiene mi email

### Verificar iconos

- [ ] Existe `public/icon-192.png`
- [ ] Existe `public/icon-512.png`
- [ ] Existe `public/apple-icon.png`

### Reiniciar servidor

- [ ] He abierto la terminal de VS Code (Ctrl + Ñ)
- [ ] He detenido el servidor si estaba corriendo (Ctrl + C)
- [ ] He ejecutado `npm run dev`
- [ ] El servidor ha iniciado sin errores
- [ ] Veo "ready - started server on 0.0.0.0:3000" o similar

### Probar notificaciones

- [ ] He abierto `http://localhost:3000` en Chrome o Edge
- [ ] He esperado 5 segundos
- [ ] Ha aparecido un modal pidiendo permiso para notificaciones
- [ ] He hecho clic en "Aceptar"
- [ ] He visto el mensaje "Notificaciones activadas" (o similar)

### Probar Google Analytics (opcional)

- [ ] He abierto https://analytics.google.com/
- [ ] He ido a mi propiedad "Cocorico App"
- [ ] He ido a Informes → Tiempo real
- [ ] En otra pestaña, he navegado por `http://localhost:3000`
- [ ] He visto mi visita aparecer en "Tiempo real" (puede tardar 30 seg)

### Probar dashboard de admin

- [ ] He iniciado sesión en la app con mi email (el de ADMIN_EMAIL)
- [ ] He abierto `http://localhost:3000/admin/analytics`
- [ ] He visto la página del dashboard (puede estar vacía de datos)
- [ ] NO he visto "Acceso denegado"

**✅ VERIFICACIÓN FINAL: [ ]** (marca cuando todo funcione)

---

## 🎉 Completado

Si has marcado TODAS las casillas de arriba, ¡felicidades! Has configurado:

- ✅ Notificaciones push con Firebase
- ✅ Analítica web con Google Analytics 4
- ✅ Iconos PWA para instalación en móviles
- ✅ Dashboard de administración con tu email

**Próximos pasos:**

1. Genera más contenido en tu app (recetas, chats IA, etc.)
2. Prueba las notificaciones en un móvil real
3. Revisa Google Analytics cada semana
4. Cuando estés listo, despliega en Vercel:
   - Sube a GitHub
   - Conecta repo a Vercel
   - Añade TODAS las variables de entorno en Vercel
   - Despliega

**¿Algo no funciona?** Consulta `FAQ.md` o pregúntame el error específico.

---

**Fecha de configuración:** ____________

**Configurado por:** ___________________

**Notas adicionales:**

---

---

---
