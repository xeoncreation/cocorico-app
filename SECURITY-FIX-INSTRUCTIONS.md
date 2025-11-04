# 🔐 Instrucciones de Seguridad - Rotación de API Key

**Estado actual:** ✅ Fase 1 completada (clave eliminada del código, commits realizados)

---

## ⚠️ IMPORTANTE: La clave Firebase expuesta fue detectada

La clave `AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q` estaba visible en `GUIA_VISUAL.md` y ha sido eliminada del código.

**NOTA IMPORTANTE:** Esta es una clave de **Firebase** (no Google Maps). Firebase API Keys son públicas por diseño y están pensadas para usarse en el cliente. La seguridad de Firebase se controla mediante:
- **Authentication**: Solo usuarios autenticados pueden acceder.
- **Security Rules**: En Firestore/Storage/Realtime Database.
- **Domain restrictions**: En Firebase Console → Project Settings.

Si también tienes una **Google Maps/Places API Key** diferente que necesite rotación, sigue la Fase 2 para esa.

---

## 📋 Fase 2: Rotar Google Maps/Places API Key (si aplica)

### Paso 1: Acceder a Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto (o crea uno si no existe)
3. En el menú lateral: **APIs & Services** → **Credentials**

### Paso 2: Localizar y regenerar la clave

1. Busca en la lista de API Keys la que estaba expuesta
2. Click en el nombre de la clave
3. En la parte superior derecha: **REGENERATE KEY**
4. Confirma la regeneración
5. **Copia la nueva clave inmediatamente** (no la compartas)

### Paso 3: Restringir la nueva clave

#### Application restrictions (elige UNA opción)

**Para uso en navegador/cliente (Next.js público):**
- Selecciona: **HTTP referrers (web sites)**
- Agrega tus dominios:
  ```
  https://cocorico.app/*
  https://*.vercel.app/*
  http://localhost:3000/*
  http://localhost:*/*
  ```

**Para uso solo en servidor (backend privado):**
- Selecciona: **IP addresses**
- Agrega las IPs de tus servidores (Vercel no tiene IPs fijas, así que usa HTTP referrers)

#### API restrictions

- Selecciona: **Restrict key**
- Marca SOLO las APIs que usas, por ejemplo:
  - ✅ Maps JavaScript API
  - ✅ Places API
  - ✅ Geocoding API
  - ❌ (desmarca todo lo demás)

### Paso 4: Guardar y configurar en Vercel

1. Click **Save** en Google Cloud Console
2. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
3. Selecciona tu proyecto `cocorico-app`
4. Settings → Environment Variables
5. Agrega o actualiza:
   ```
   NEXT_PUBLIC_GOOGLE_API_KEY = TU_NUEVA_CLAVE_AQUI
   ```
6. Aplica a: **Production, Preview, Development**
7. Click **Save**
8. Ve a la pestaña **Deployments**
9. En el último deployment exitoso → **⋮** → **Redeploy**

### Paso 5: Configurar en local

1. Abre `.env.local` en tu proyecto local
2. Agrega o actualiza:
   ```bash
   NEXT_PUBLIC_GOOGLE_API_KEY=TU_NUEVA_CLAVE_AQUI
   ```
3. Guarda el archivo (Ctrl+S)
4. **NO** subas `.env.local` al repositorio (ya está en `.gitignore`)

### Paso 6: Eliminar la clave antigua

1. Vuelve a Google Cloud Console → Credentials
2. Localiza la clave antigua (la que estaba expuesta)
3. Click en el icono de **papelera** 🗑️
4. Confirma la eliminación

---

## 🧹 Fase 3: Limpiar historial de Git (CRÍTICO)

Aunque eliminamos la clave del código actual, **sigue existiendo en commits anteriores**. Cualquiera que clone el repo puede ver el historial completo.

### Opción A: BFG Repo-Cleaner (Recomendado para Windows)

#### Paso 1: Preparar el entorno

```powershell
# Crear una carpeta temporal
cd C:\temp
mkdir repo-cleanup
cd repo-cleanup

# Clonar el repo en modo espejo
git clone --mirror https://github.com/xeoncreation/cocorico-app.git
cd cocorico-app.git
```

#### Paso 2: Descargar BFG

1. Descarga `bfg.jar` desde: https://rtyley.github.io/bfg-repo-cleaner/
2. Coloca `bfg.jar` en `C:\temp\repo-cleanup\`

#### Paso 3: Crear archivo de reemplazos

Crea un archivo `C:\temp\repo-cleanup\replacements.txt` con este contenido:

```
AIzaSyA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q==>REDACTED_FIREBASE_KEY
```

**Si tienes otras claves expuestas**, agrégalas una por línea:
```
OTRA_CLAVE_SECRETA==>REDACTED
```

#### Paso 4: Ejecutar BFG

```powershell
# Reemplazar claves en todo el historial
java -jar ..\bfg.jar --replace-text ..\replacements.txt

# Limpiar referencias
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

#### Paso 5: Forzar push (⚠️ CUIDADO)

```powershell
# ADVERTENCIA: Esto reescribe el historial público
# Coordina con tu equipo antes de hacer esto
git push --force
```

#### Paso 6: Limpiar local y re-clonar

```powershell
# Volver a tu proyecto
cd C:\Users\yo-90\cocorico

# Forzar actualización
git fetch origin
git reset --hard origin/main

# O mejor: clonar de nuevo limpio
cd ..
mv cocorico cocorico-OLD
git clone https://github.com/xeoncreation/cocorico-app.git cocorico
cd cocorico
```

### Opción B: Eliminar archivo completo del historial

Si prefieres **borrar completamente** `GUIA_VISUAL.md` del historial:

```powershell
cd C:\temp\repo-cleanup\cocorico-app.git
java -jar ..\bfg.jar --delete-files GUIA_VISUAL.md
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

Luego vuelve a crear `GUIA_VISUAL.md` con placeholders y haz un nuevo commit.

---

## 🛡️ Fase 4: Prevención Futura

### 4.1 Activar Secret Scanning en GitHub

1. Ve a tu repo: https://github.com/xeoncreation/cocorico-app
2. **Settings** (pestaña superior)
3. **Code security and analysis** (menú lateral izquierdo)
4. Activa:
   - ✅ **Secret scanning** → Enable
   - ✅ **Push protection** → Enable (bloquea commits con secretos)

### 4.2 Instalar Gitleaks (detección local pre-commit)

#### En Windows con Chocolatey

```powershell
# Instalar Chocolatey si no lo tienes:
# https://chocolatey.org/install

# Instalar gitleaks
choco install gitleaks -y

# Verificar instalación
gitleaks version
```

#### Configurar pre-commit hook

```powershell
cd C:\Users\yo-90\cocorico

# Crear hook pre-commit
New-Item -ItemType Directory -Force -Path .git\hooks

# Crear archivo pre-commit (sin extensión)
@'
#!/bin/sh
gitleaks protect --staged --verbose
'@ | Out-File -FilePath .git\hooks\pre-commit -Encoding ASCII

# Si usas Git Bash en Windows, dale permisos:
# chmod +x .git/hooks/pre-commit
```

#### Alternativa con Husky (recomendado para equipos)

```powershell
npm install --save-dev husky
npx husky init
echo "gitleaks protect --staged" > .husky\pre-commit
```

### 4.3 Configurar `.gitleaks.toml` (opcional)

Crea `C:\Users\yo-90\cocorico\.gitleaks.toml`:

```toml
title = "Cocorico Gitleaks Config"

[allowlist]
description = "Allowlist de falsos positivos"

# Permite claves de ejemplo en .env.example
paths = [
  '''\.env\.example$''',
  '''SECURITY-FIX-INSTRUCTIONS\.md$'''
]

# Ignora placeholders comunes
regexes = [
  '''YOUR_.*_KEY_HERE''',
  '''REDACTED''',
  '''PEGA_AQUI_TU_'''
]
```

---

## ✅ Checklist Final

Marca cada paso cuando lo completes:

### Fase 1 (Código)
- [x] Clave eliminada de `GUIA_VISUAL.md`
- [x] `.env.example` creado con placeholders
- [x] `.gitignore` configurado correctamente
- [x] Commits realizados y pusheados

### Fase 2 (Rotar clave)
- [ ] Nueva clave generada en Google Cloud Console
- [ ] Restricciones de dominio aplicadas
- [ ] Restricciones de API aplicadas
- [ ] Clave configurada en Vercel
- [ ] Clave configurada en `.env.local`
- [ ] Redeploy realizado en Vercel
- [ ] Clave antigua eliminada

### Fase 3 (Limpiar historial)
- [ ] BFG descargado y ejecutado
- [ ] Historial limpiado con `--replace-text` o `--delete-files`
- [ ] `git push --force` realizado
- [ ] Repo local re-clonado limpio
- [ ] Equipo notificado de la reescritura de historial

### Fase 4 (Prevención)
- [ ] Secret scanning activado en GitHub
- [ ] Push protection activado en GitHub
- [ ] Gitleaks instalado localmente
- [ ] Pre-commit hook configurado
- [ ] `.gitleaks.toml` configurado (opcional)

---

## 🆘 Soporte

Si necesitas ayuda en algún paso:

1. **Google Cloud Console:** [Documentación de API Keys](https://cloud.google.com/docs/authentication/api-keys)
2. **BFG Repo-Cleaner:** [Guía oficial](https://rtyley.github.io/bfg-repo-cleaner/)
3. **Gitleaks:** [Documentación](https://github.com/gitleaks/gitleaks)
4. **GitHub Secret Scanning:** [Docs](https://docs.github.com/en/code-security/secret-scanning)

---

**Última actualización:** $(date) - Generado automáticamente por Code Manager
