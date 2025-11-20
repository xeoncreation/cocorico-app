# 🚀 GUÍA PASO A PASO: CONFIGURACIÓN DE COCORICO

Esta guía te ayudará a configurar Firebase (notificaciones push), Google Analytics y los iconos PWA desde cero, aunque no sepas nada de estas tecnologías.

---

## 📱 PARTE 1: CONFIGURAR FIREBASE (Notificaciones Push)

### ¿Qué es Firebase?
Es un servicio de Google que nos permite enviar notificaciones push a los usuarios de la aplicación web.

### Paso 1.1: Crear una cuenta en Firebase

1. **Abre tu navegador** (Chrome, Edge, Firefox, etc.)
2. **Ve a esta dirección**: https://console.firebase.google.com/
3. **Inicia sesión** con tu cuenta de Google (Gmail)
   - Si no tienes cuenta de Google, créala primero en https://accounts.google.com/

### Paso 1.2: Crear un proyecto

1. Verás una página con tus proyectos de Firebase (probablemente vacía si es tu primera vez)
2. Haz clic en el botón grande **"Agregar proyecto"** o **"Add project"**
3. **Pantalla 1 - Nombre del proyecto**:
   - Escribe: `cocorico-notifications`
   - Haz clic en **"Continuar"**
4. **Pantalla 2 - Google Analytics**:
   - Puedes desactivar el interruptor (no lo necesitamos aquí)
   - Haz clic en **"Crear proyecto"**
5. **Espera** 20-30 segundos mientras se crea el proyecto
6. Cuando aparezca "Tu proyecto está listo", haz clic en **"Continuar"**

### Paso 1.3: Registrar una aplicación web

1. Verás el panel principal de tu proyecto
2. En el centro de la pantalla hay 3 iconos grandes. Haz clic en el icono **"</>"** (Web)
3. **Nombre de la app**: Escribe `Cocorico Web`
4. **NO marques** la casilla "También configurar Firebase Hosting"
5. Haz clic en **"Registrar app"**

### Paso 1.4: Copiar las credenciales (¡IMPORTANTE!)

1. Verás un cuadro de código que empieza con `const firebaseConfig = {`
2. **Abre el bloc de notas de Windows** (búscalo en el menú Inicio)
3. **Copia y pega** todo el objeto `firebaseConfig` en el bloc de notas
4. Debería verse algo así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA1B2C3D4E5F6G7H8I9J0K...",
  authDomain: "cocorico-notifications.firebaseapp.com",
  projectId: "cocorico-notifications",
  storageBucket: "cocorico-notifications.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456..."
};
```

5. **Guarda este archivo** como `firebase-credentials.txt` en tu escritorio
6. En la ventana de Firebase, haz clic en **"Continuar a la consola"**

### Paso 1.5: Activar Cloud Messaging

1. En el **menú lateral izquierdo**, busca la sección **"Compilación"** o **"Build"**
2. Haz clic en **"Cloud Messaging"**
3. Si te pide activar el servicio, haz clic en **"Comenzar"** o **"Get started"**

### Paso 1.6: Obtener la clave VAPID

1. Haz clic en el **ícono de engranaje ⚙️** arriba a la izquierda
2. Selecciona **"Configuración del proyecto"** o **"Project settings"**
3. Haz clic en la pestaña **"Cloud Messaging"**
4. Baja hasta encontrar **"Configuración web"** o **"Web configuration"**
5. Si ves un botón **"Generar par de claves"**, haz clic en él
6. **Verás una clave larga** que empieza con letras y números (ej: `BK3x...`)
7. Haz clic en el ícono de **copiar** 📋 al lado de la clave
8. **Pégala en tu bloc de notas** y escribe arriba: `VAPID_KEY:`

### Paso 1.7: Activar Cloud Messaging API (Legacy)

1. En la **misma página** (Cloud Messaging), ve arriba del todo
2. Busca **"Cloud Messaging API (Legacy)"**
3. Si dice **"Deshabilitado"** o **"Disabled"**:
   - Haz clic en el **menú de 3 puntos ⋮** al lado
   - Selecciona **"Manage API in Google Cloud Console"**
   - Se abrirá una **nueva pestaña** en Google Cloud
   - Haz clic en el botón azul **"ENABLE"** o **"HABILITAR"**
   - **Espera** 10-20 segundos
4. **Vuelve a la pestaña de Firebase** y **recarga la página** (F5)
5. Ahora verás **"Server key"** con un candado 🔒 y una clave larga
6. Haz clic en el ícono de **copiar** 📋
7. **Pégala en tu bloc de notas** y escribe arriba: `SERVER_KEY:`

### Paso 1.8: Transferir credenciales al archivo .env.local

1. **Abre VS Code** con tu proyecto Cocorico
2. En el explorador de archivos, busca el archivo **`.env.local`** en la raíz
3. **Abre el archivo** `firebase-credentials.txt` de tu escritorio
4. **Copia cada valor** del bloc de notas al `.env.local`:

   - `apiKey` → pégalo en `NEXT_PUBLIC_FIREBASE_API_KEY=`
   - `authDomain` → pégalo en `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=`
   - `projectId` → pégalo en `NEXT_PUBLIC_FIREBASE_PROJECT_ID=`
   - `storageBucket` → pégalo en `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=`
   - `messagingSenderId` → pégalo en `NEXT_PUBLIC_FIREBASE_SENDER_ID=`
   - `appId` → pégalo en `NEXT_PUBLIC_FIREBASE_APP_ID=`
   - La `VAPID_KEY` → pégala en `NEXT_PUBLIC_FIREBASE_VAPID_KEY=`
   - La `SERVER_KEY` → pégala en `FIREBASE_SERVER_KEY=`

5. **Guarda el archivo** `.env.local` (Ctrl + S)

---

## 📊 PARTE 2: CONFIGURAR GOOGLE ANALYTICS 4

### ¿Qué es Google Analytics?
Es una herramienta gratuita de Google que te permite ver cuántas personas visitan tu web, qué páginas ven, etc.

### Paso 2.1: Crear una cuenta de Analytics

1. **Abre tu navegador**
2. **Ve a**: https://analytics.google.com/
3. **Inicia sesión** con tu cuenta de Google (la misma que usaste para Firebase)
4. Si es tu primera vez, verás una pantalla de bienvenida
5. Haz clic en **"Empezar a medir"** o **"Start measuring"**

### Paso 2.2: Configurar la cuenta

1. **Nombre de la cuenta**: Escribe `Cocorico`
2. **Compartir datos**: Puedes dejar todo marcado o desmarcar (no es importante)
3. Haz clic en **"Siguiente"**

### Paso 2.3: Crear una propiedad

1. **Nombre de la propiedad**: Escribe `Cocorico App`
2. **Zona horaria**: Selecciona tu país (ej: `(GMT+01:00) Madrid`)
3. **Moneda**: Selecciona tu moneda (ej: `EUR - Euro`)
4. Haz clic en **"Siguiente"**

### Paso 2.4: Información del negocio

1. **Sector**: Selecciona `Alimentación y bebidas` o `Comunidad online`
2. **Tamaño de la empresa**: Selecciona lo que más se ajuste (ej: `Pequeña - 1-10 empleados`)
3. Haz clic en **"Siguiente"**
4. **Objetivos empresariales**: Marca lo que quieras (ej: `Analizar el comportamiento del usuario`)
5. Haz clic en **"Crear"**
6. **Acepta** los términos de servicio marcando las casillas
7. Haz clic en **"Acepto"**

### Paso 2.5: Configurar el flujo de datos web

1. Selecciona **"Web"** (el icono de un navegador)
2. **URL del sitio web**: Escribe `https://cocorico.app` (o `http://localhost:3000` si vas a probar primero)
3. **Nombre del flujo**: Escribe `Cocorico Web`
4. Deja marcado **"Medición mejorada"**
5. Haz clic en **"Crear flujo"**

### Paso 2.6: Copiar el Measurement ID

1. Verás una pantalla con **"Detalles del flujo web"**
2. Arriba a la derecha verás **"ID DE MEDICIÓN"** o **"MEASUREMENT ID"**
3. Debajo hay un código que empieza con **`G-`** (ej: `G-ABCD123456`)
4. **Haz clic en el ícono de copiar** 📋
5. **Abre VS Code** y ve al archivo `.env.local`
6. Busca la línea `NEXT_PUBLIC_GA_ID=`
7. **Pega el ID** que copiaste (debe quedar algo como `NEXT_PUBLIC_GA_ID=G-ABCD123456`)
8. **Guarda el archivo** (Ctrl + S)

---

## 🎨 PARTE 3: GENERAR ICONOS PWA

### ¿Qué son los iconos PWA?
Son las imágenes que aparecen cuando un usuario "instala" tu web en su móvil, como si fuera una app nativa.

### Opción A: Generar iconos online (MÁS FÁCIL)

#### Paso 3.1: Preparar tu logo

1. Necesitas una imagen de tu logo en formato **PNG**
2. Debe ser **cuadrada** (mismo ancho que alto)
3. Tamaño mínimo: **512x512 píxeles**
4. Si tu logo no es cuadrado:
   - Abre Paint (búscalo en Windows)
   - Crea una nueva imagen de 512x512
   - Pega tu logo en el centro
   - Guárdalo como `logo-cocorico.png`

#### Paso 3.2: Generar los iconos

1. **Ve a**: https://realfavicongenerator.net/
2. Haz clic en **"Select your Favicon image"**
3. Selecciona tu archivo `logo-cocorico.png`
4. Espera a que suba (5-10 segundos)
5. Verás una previsualización de cómo se verá en diferentes plataformas
6. **Baja hasta el final** de la página
7. Haz clic en el botón grande **"Generate your Favicons and HTML code"**
8. Espera 5-10 segundos
9. Haz clic en **"Favicon package"** para descargar un archivo ZIP

#### Paso 3.3: Copiar los iconos a tu proyecto

1. **Abre el archivo ZIP** que descargaste (haz doble clic)
2. Verás varios archivos PNG. Necesitamos estos:
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`
   - `apple-touch-icon.png`
3. **Abre una nueva ventana del explorador de archivos**
4. Ve a `C:\Users\yo-90\cocorico\public\`
5. **Arrastra** los 3 archivos del ZIP a la carpeta `public`
6. **Renómbralos** así:
   - `android-chrome-192x192.png` → `icon-192.png`
   - `android-chrome-512x512.png` → `icon-512.png`
   - `apple-touch-icon.png` → `apple-icon.png`

### Opción B: Generar iconos con comando (requiere tener logo en public/)

1. Asegúrate de tener un archivo `logo.png` en la carpeta `public`
2. **Abre PowerShell** en VS Code (Ctrl + Ñ)
3. **Ejecuta este comando**:
```powershell
npx pwa-asset-generator public/logo.png public/icons --icon-only
```
4. Espera 10-20 segundos
5. Los iconos se generarán en `public/icons/`

---

## 👤 PARTE 4: CONFIGURAR TU EMAIL DE ADMIN

Este es **el más fácil**:

1. **Abre** el archivo `.env.local` en VS Code
2. Busca la línea `ADMIN_EMAIL=`
3. Escribe tu email (el que usas para iniciar sesión en Cocorico)
4. Ejemplo: `ADMIN_EMAIL=tuemail@gmail.com`
5. **Guarda** (Ctrl + S)

---

## ✅ VERIFICACIÓN FINAL

Cuando hayas completado todo, tu archivo `.env.local` debe verse así:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA1B2C3D4E5F6G7H8I9J0K...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cocorico-notifications.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cocorico-notifications
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cocorico-notifications.appspot.com
NEXT_PUBLIC_FIREBASE_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BK3x...
FIREBASE_SERVER_KEY=AAAA...
NEXT_PUBLIC_GA_ID=G-ABCD123456
ADMIN_EMAIL=tuemail@gmail.com
```

**Ningún valor debe estar con "PEGA_AQUI_TU_..."**

---

## 🧪 PROBAR QUE TODO FUNCIONA

1. **Cierra el servidor** de desarrollo si está corriendo (Ctrl + C en la terminal)
2. **Reinicia el servidor**:
```powershell
npm run dev
```
3. **Abre el navegador** en `http://localhost:3000`
4. **Después de 5 segundos** debería aparecer un mensaje pidiendo permiso para notificaciones
5. Si haces clic en "Aceptar", verás un mensaje de éxito

---

## 🆘 PROBLEMAS COMUNES

### "No me aparece el botón de generar par de claves VAPID"
- Recarga la página de Firebase (F5)
- Asegúrate de estar en la pestaña "Cloud Messaging"

### "No puedo activar Cloud Messaging API (Legacy)"
- Asegúrate de haber aceptado los términos en Google Cloud Console
- Espera 1-2 minutos después de habilitar y recarga la página

### "Mi logo no es cuadrado"
- Usa Paint para crear un canvas de 512x512
- Centra tu logo dentro del canvas
- Rellena el fondo de blanco si es necesario

### "El archivo .env.local no aparece en VS Code"
- Presiona Ctrl + P
- Escribe ".env.local"
- Si no existe, créalo manualmente en la raíz del proyecto

---

## 📞 ¿NECESITAS AYUDA?

Si te atascas en algún paso, dime exactamente en qué paso estás y qué mensaje de error ves (si hay alguno). ¡Estoy aquí para ayudarte!
