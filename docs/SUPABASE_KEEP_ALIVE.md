# 🔄 Sistema de Keep-Alive para Supabase

Este proyecto incluye un sistema automático para mantener activa la base de datos de Supabase y evitar que entre en pausa por inactividad.

## 🚀 Uso Manual

Ejecuta cualquiera de estos comandos cuando quieras generar actividad:

```bash
# Actividad básica (consultas simples)
npm run supabase:activity

# Actividad avanzada (28+ operaciones)
npx tsx scripts/generate-advanced-activity.ts
```

## ⚙️ Automatización con GitHub Actions

El workflow `.github/workflows/supabase-keep-alive.yml` se ejecuta automáticamente **todos los días a las 12:00 UTC**.

### Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Agrega estos secrets:

```
NEXT_PUBLIC_SUPABASE_URL=https://dxhgpjrgvkxudetbmxuw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
IMPORT_USER_ID=c389b64a-e6e0-4a6c-b570-e12e19179c5b
```

### Ejecución Manual

También puedes ejecutar el workflow manualmente:

1. Ve a GitHub → Actions
2. Selecciona "Supabase Keep-Alive"
3. Click en "Run workflow"

## 📊 Qué hace el script

El script de actividad avanzada realiza:

- ✅ 16 consultas a diferentes tablas
- ✅ 3 consultas con filtros complejos
- ✅ 5 búsquedas textuales
- ✅ Cálculos de estadísticas agregadas
- ✅ Consultas relacionadas (joins)
- ✅ Análisis temporal (últimos 7 días)

**Total: 28+ operaciones por ejecución**

## 🔧 Troubleshooting

Si el workflow falla:

1. Verifica que los secrets estén configurados correctamente
2. Revisa los logs en GitHub Actions
3. Ejecuta manualmente: `npm run supabase:keep-alive`

## 📅 Frecuencia Recomendada

- **Automático**: Diario (configurado)
- **Manual**: Semanalmente para verificar
- **Antes del 1 de cada mes**: Para evitar pausas

## 🎯 Objetivo

Mantener el proyecto de Supabase activo y demostrar uso constante para evitar que entre en pausa automática.
