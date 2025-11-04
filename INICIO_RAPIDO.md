# 🎯 RESUMEN RÁPIDO - LO QUE TIENES QUE HACER

**Tiempo estimado:** 20-30 minutos  
**Dificultad:** Principiante (todo explicado paso a paso)

---

## 📋 LAS 4 TAREAS PRINCIPALES

### ✅ TAREA 1: FIREBASE (10-15 min)
**Para qué:** Enviar notificaciones push a los usuarios

1. Ve a https://console.firebase.google.com/
2. Crea proyecto "cocorico-notifications"
3. Añade app Web "Cocorico Web"
4. Copia las 6 credenciales del `firebaseConfig`
5. Habilita Cloud Messaging
6. Genera clave VAPID (empieza con BK...)
7. Habilita Cloud Messaging API (Legacy)
8. Copia Server Key (empieza con AAAA...)
9. Pega todo en `.env.local`

**📖 Guía detallada:** `GUIA_CONFIGURACION.md` → PARTE 1  
**🖼️ Capturas de pantalla:** `GUIA_VISUAL.md` → FIREBASE

---

### ✅ TAREA 2: GOOGLE ANALYTICS (5-10 min)
**Para qué:** Ver estadísticas de visitas y uso

1. Ve a https://analytics.google.com/
2. Crea cuenta "Cocorico"
3. Crea propiedad "Cocorico App"
4. Añade plataforma Web
5. Copia el ID de medición (G-XXXXXXXXXX)
6. Pega en `.env.local` → `NEXT_PUBLIC_GA_ID=`

**📖 Guía detallada:** `GUIA_CONFIGURACION.md` → PARTE 2  
**🖼️ Capturas de pantalla:** `GUIA_VISUAL.md` → GOOGLE ANALYTICS

---

### ✅ TAREA 3: ICONOS PWA (5 min)
**Para qué:** Que la app se vea bien cuando se "instale" en móviles

1. Prepara tu logo (PNG cuadrado, 512x512px mínimo)
2. Ve a https://realfavicongenerator.net/
3. Sube el logo
4. Descarga el ZIP
5. Copia estos 3 archivos a `public/`:
   - `android-chrome-192x192.png` → `icon-192.png`
   - `android-chrome-512x512.png` → `icon-512.png`
   - `apple-touch-icon.png` → `apple-icon.png`

**📖 Guía detallada:** `GUIA_CONFIGURACION.md` → PARTE 3  
**🖼️ Capturas de pantalla:** `GUIA_VISUAL.md` → ICONOS PWA

---

### ✅ TAREA 4: EMAIL DE ADMIN (30 segundos)
**Para qué:** Acceder al dashboard de analytics

1. Abre `.env.local`
2. En la línea `ADMIN_EMAIL=` escribe tu email
3. Guarda (Ctrl + S)

**📖 Guía detallada:** `GUIA_CONFIGURACION.md` → PARTE 4

---

## 📂 ARCHIVOS QUE VAS A EDITAR

```
c:\Users\yo-90\cocorico\
├── .env.local          ← AQUÍ pegarás TODAS las credenciales
└── public/
    ├── icon-192.png    ← AQUÍ copiarás el icono de 192x192
    ├── icon-512.png    ← AQUÍ copiarás el icono de 512x512
    └── apple-icon.png  ← AQUÍ copiarás el icono de Apple
```

---

## 🔑 CREDENCIALES QUE VAS A OBTENER

| Servicio | Qué copiar | Dónde pegarlo en .env.local |
|----------|------------|---------------------------|
| **Firebase** | apiKey | `NEXT_PUBLIC_FIREBASE_API_KEY=` |
| Firebase | authDomain | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=` |
| Firebase | projectId | `NEXT_PUBLIC_FIREBASE_PROJECT_ID=` |
| Firebase | storageBucket | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=` |
| Firebase | messagingSenderId | `NEXT_PUBLIC_FIREBASE_SENDER_ID=` |
| Firebase | appId | `NEXT_PUBLIC_FIREBASE_APP_ID=` |
| Firebase | VAPID Key | `NEXT_PUBLIC_FIREBASE_VAPID_KEY=` |
| Firebase | Server Key | `FIREBASE_SERVER_KEY=` |
| **Analytics** | Measurement ID | `NEXT_PUBLIC_GA_ID=` |
| **Tu email** | tuemail@gmail.com | `ADMIN_EMAIL=` |

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de probar la app, asegúrate de:

- [ ] `.env.local` existe en la raíz del proyecto
- [ ] TODAS las líneas de Firebase tienen valores (no "PEGA_AQUI_TU_...")
- [ ] La línea `NEXT_PUBLIC_GA_ID=` tiene un valor que empieza con `G-`
- [ ] La línea `ADMIN_EMAIL=` tiene tu email
- [ ] Los 3 iconos PNG están en la carpeta `public/`
- [ ] Has guardado `.env.local` (Ctrl + S)
- [ ] Has reiniciado el servidor (`Ctrl + C` → `npm run dev`)

---

## 🧪 PRUEBA RÁPIDA

```powershell
# 1. Reinicia el servidor
npm run dev

# 2. Abre el navegador
# Ve a: http://localhost:3000

# 3. Espera 5 segundos
# Debería aparecer un modal de notificaciones

# 4. Acepta las notificaciones
# Si aparece "Notificaciones activadas" → ✅ TODO FUNCIONA
```

---

## 🆘 SI ALGO FALLA

1. **Abre la consola del navegador:** F12 → pestaña "Console"
2. **Busca errores en rojo** (líneas que empiezan con ❌)
3. **Lee el FAQ:** `FAQ.md` → busca tu error
4. **Si no lo encuentras:** dime qué error ves

---

## 📚 DOCUMENTACIÓN COMPLETA

| Archivo | Para qué sirve |
|---------|---------------|
| **ESTE ARCHIVO** | Resumen de 1 página |
| `GUIA_CONFIGURACION.md` | Instrucciones paso a paso detalladas |
| `GUIA_VISUAL.md` | Capturas de pantalla de cada paso |
| `FAQ.md` | Preguntas frecuentes y solución de errores |
| `.env.example` | Plantilla de variables (NO editar) |
| `.env.local` | TUS credenciales (editar aquí) |

---

## 🎯 ORDEN RECOMENDADO

1. **Primero:** Lee este archivo completo (5 min)
2. **Luego:** Abre `GUIA_CONFIGURACION.md` en VS Code
3. **Mientras:** Sigue los pasos con `GUIA_VISUAL.md` al lado
4. **Si falla:** Consulta `FAQ.md`
5. **Al final:** Ejecuta la prueba rápida (arriba ↑)

---

## 💡 CONSEJOS

- **No te saltes pasos:** Aunque parezcan obvios, cada uno es importante
- **Copia EXACTAMENTE:** Las credenciales no pueden tener espacios al principio/final
- **Guarda siempre:** Después de pegar cada credencial, guarda con Ctrl+S
- **Reinicia el servidor:** Los cambios en `.env.local` solo se aplican al reiniciar

---

## ⏱️ TIEMPO ESTIMADO POR TAREA

| Tarea | Primera vez | Si ya sabes |
|-------|------------|------------|
| Firebase | 15 min | 5 min |
| Analytics | 10 min | 3 min |
| Iconos PWA | 5 min | 2 min |
| Email Admin | 1 min | 30 seg |
| **TOTAL** | **~30 min** | **~10 min** |

---

**¡Listo! Empieza con la TAREA 1 cuando quieras. Mucha suerte! 🚀**

*Si te atascas, recuerda: estoy aquí para ayudarte en cada paso.*
