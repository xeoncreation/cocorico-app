# Cocorico Mobile

Esta carpeta contiene la aplicación móvil nativa de Cocorico construida con Expo.

## 🚀 Setup inicial

```bash
cd cocorico-mobile
npm install
```

## 📱 Desarrollo

### Ejecutar en simulador/emulador
```bash
# iOS (requiere macOS + Xcode)
npm run ios

# Android (requiere Android Studio)
npm run android

# Web
npm run web
```

### Ejecutar en dispositivo físico
```bash
npm start
```
Escanea el código QR con Expo Go app.

## 🏗️ Build para producción

### Android APK/AAB
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build
npm run build:android
```

### iOS (requiere cuenta Apple Developer)
```bash
npm run build:ios
```

## 📦 Características nativas

- ✅ Cámara (expo-camera) - Identificar ingredientes
- ✅ Micrófono (expo-av) - Comandos de voz
- ✅ Notificaciones push (expo-notifications)
- ✅ Almacenamiento local (expo-file-system)
- ✅ Autenticación biométrica (expo-local-authentication)

## 🔗 Cambiar URL del servidor

Por defecto apunta a `https://cocorico-app.vercel.app`.

Para desarrollo local, edita `app/index.tsx`:
```typescript
const [webViewUrl] = useState('http://TU_IP_LOCAL:3000');
```

## 📄 Configuración

- `app.json`: Configuración de Expo (permisos, iconos, splash)
- `package.json`: Dependencias
- `app/index.tsx`: WebView principal

## 🎨 Assets necesarios

Coloca estos archivos en `assets/`:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024, Android)
- `favicon.png` (48x48, Web)
