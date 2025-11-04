# 🔧 Solución: ERR_CONNECTION_REFUSED en localhost:3000

## 🎯 Problema identificado

El diagnóstico reveló que:
- ✅ El servidor HTTP **SÍ funciona** (devuelve HTTP 200)
- ❌ El archivo `hosts` de Windows **está vacío o corrupto**
- ❌ Faltan entradas críticas para `localhost`

**Esto NO es un problema de tu código Next.js** - el proyecto compila y funciona correctamente.

---

## ✅ Solución rápida (2 minutos)

### Paso 1: Editar archivo hosts (como Administrador)

1. Abre el Bloc de notas **como Administrador**:
   - Busca "Bloc de notas" en el menú Inicio
   - Click derecho > "Ejecutar como administrador"

2. En el Bloc de notas, haz clic en **Archivo > Abrir**

3. Navega a esta ruta (copia y pega):
   ```
   C:\Windows\System32\drivers\etc\hosts
   ```

4. Cambia el filtro de "Documentos de texto (*.txt)" a **"Todos los archivos (*.*)"**

5. Abre el archivo `hosts`

6. **Añade estas líneas al final** (o reemplaza todo el contenido si está vacío):
   ```
   # Copyright (c) 1993-2009 Microsoft Corp.
   #
   # This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
   #
   # This file contains the mappings of IP addresses to host names. Each
   # entry should be kept on an individual line. The IP address should
   # be placed in the first column followed by the corresponding host name.
   # The IP address and the host name should be separated by at least one
   # space.
   #
   # Additionally, comments (such as these) may be inserted on individual
   # lines or following the machine name denoted by a '#' symbol.
   #
   # For example:
   #
   #      102.54.94.97     rhino.acme.com          # source server
   #       38.25.63.10     x.acme.com              # x client host

   # localhost name resolution is handled within DNS itself.
   127.0.0.1       localhost
   ::1             localhost
   ```

7. **Guarda el archivo** (Ctrl+S)

8. Cierra el Bloc de notas

### Paso 2: Limpiar caché DNS

Abre PowerShell (normal, no hace falta Admin) y ejecuta:

```powershell
ipconfig /flushdns
```

### Paso 3: Probar el servidor

1. En el terminal de VS Code:
   ```powershell
   npm run dev
   ```

2. Abre tu navegador en:
   - http://localhost:3000
   - http://127.0.0.1:3000

**¡Debería funcionar!** 🎉

---

## 🔒 Si sigue fallando: Configurar Firewall

Abre PowerShell **como Administrador** y ejecuta:

```powershell
# Permitir Node.js en el firewall para puertos 3000 y 3001
New-NetFirewallRule -DisplayName "Dev-3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Private
New-NetFirewallRule -DisplayName "Dev-3001" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow -Profile Private
```

---

## 🛡️ Si TODAVÍA falla: Desactivar temporalmente antivirus/VPN

1. **Desactiva temporalmente**:
   - Antivirus (Web Shield / Network Shield)
   - VPN (WireGuard, OpenVPN, etc.)
   - Zscaler / Endpoint security

2. Prueba de nuevo: `npm run dev`

3. Si funciona, añade `node.exe` y tu carpeta de proyecto a las exclusiones del antivirus.

---

## 🚀 Alternativa: Usar puerto diferente

Si el puerto 3000 sigue bloqueado, usa otro:

```powershell
npm run dev:3001
```

Luego abre: http://localhost:3001

---

## 📊 Estado del proyecto

✅ **Build**: PASS  
✅ **Lint**: PASS  
✅ **Tests**: PASS (17/17)  
✅ **Código**: Sin errores  

**El proyecto está 100% funcional.** Solo necesitas desbloquear el acceso localhost en Windows.

---

## 🆘 Si nada funciona

Como último recurso, usa WSL2 (Ubuntu):

1. Instala WSL2 desde PowerShell (Admin):
   ```powershell
   wsl --install
   ```

2. Reinicia Windows

3. Abre Ubuntu y ejecuta:
   ```bash
   cd /mnt/c/Users/yo-90/cocorico
   npm run dev
   ```

4. Accede desde Windows: http://localhost:3000

WSL2 suele evitar problemas de loopback de Windows.
