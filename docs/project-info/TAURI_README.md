# Cocorico Desktop (Tauri)

Aplicación de escritorio nativa de Cocorico para Windows, macOS y Linux.

## 🚀 Setup inicial

```bash
# Instalar Tauri CLI (solo primera vez)
npm install --save-dev @tauri-apps/cli

# Inicializar Tauri (solo si es necesario)
npx tauri init
```

## 📦 Requisitos previos

### Windows
- Microsoft Visual Studio C++ Build Tools
- WebView2 (usualmente pre-instalado en Windows 10/11)

### macOS
- Xcode Command Line Tools: `xcode-select --install`

### Linux
- Dependencias: 
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

## 🛠️ Desarrollo

```bash
# Ejecutar en modo desarrollo
npx tauri dev
```

Esto abrirá la app desktop usando tu servidor Next.js local en http://localhost:3000

## 🏗️ Build para producción

```bash
# Build de la app Next.js primero
npm run build

# Exportar estático
npm run export

# Build de Tauri
npx tauri build
```

Los ejecutables estarán en `src-tauri/target/release/bundle/`

### Outputs por plataforma:
- **Windows**: `.exe` + `.msi` installer
- **macOS**: `.app` + `.dmg` installer  
- **Linux**: `.AppImage` + `.deb` package

## ⚙️ Configuración

- `tauri.conf.json`: Configuración principal
  - Window settings (tamaño, título, etc.)
  - Permisos de seguridad
  - Iconos y metadata
  - CSP (Content Security Policy)

- `src-tauri/Cargo.toml`: Dependencias de Rust

## 🔧 Personalización avanzada

### Cambiar URL de producción
Edita `tauri.conf.json`:
```json
{
  "build": {
    "devPath": "http://localhost:3000",
    "distDir": "../out"  // o la ruta a tu build
  }
}
```

### Agregar atajos de teclado
Edita `src-tauri/src/main.rs` para añadir shortcuts globales.

### Actualización automática
Habilita en `tauri.conf.json`:
```json
{
  "tauri": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://releases.myapp.com/{{target}}/{{current_version}}"
      ]
    }
  }
}
```

## 📋 Checklist antes de release

- [ ] Actualizar `version` en `tauri.conf.json`
- [ ] Generar iconos en todos los tamaños necesarios
- [ ] Firmar app (Windows + macOS para distribución)
- [ ] Probar en todas las plataformas objetivo
- [ ] Configurar auto-update (opcional)

## 🎯 Ventajas de Tauri

- **Ligero**: ~600KB overhead vs. ~180MB de Electron
- **Seguro**: Rust + CSP + sandboxing
- **Rápido**: WebView nativa del sistema
- **Cross-platform**: Un solo código para todas las plataformas
