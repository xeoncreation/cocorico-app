# 🚀 Guía Rápida de Instalación - Sistema Freemium

## ✅ Checklist de Instalación

- [ ] **Paso 1:** Aplicar migración en Supabase
- [ ] **Paso 2:** Verificar tablas creadas
- [ ] **Paso 3:** Probar sistema localmente
- [ ] **Paso 4:** Deploy a producción

---

## 📝 Paso 1: Aplicar Migración en Supabase

### Opción A: Desde el Dashboard (RECOMENDADO)

1. Ir a [Supabase Dashboard](https://app.supabase.com)
2. Seleccionar tu proyecto Cocorico
3. En el menú lateral: **SQL Editor**
4. Click en **New query**
5. Copiar y pegar todo el contenido de: `INSTALACION_FREEMIUM.sql`
6. Click en **Run** (botón verde)
7. Verificar que aparezca: "Success. No rows returned"

### Opción B: Desde CLI

```bash
# Si tienes Supabase CLI instalado
cd c:\Users\yo-90\cocorico
supabase db push
```

---

## 🔍 Paso 2: Verificar que Todo Funciona

### En Supabase Dashboard

1. Ir a **Database** > **Tables**
2. Verificar que existen:
   - ✅ `user_plans`
   - ✅ `feature_usage`

3. Click en cada tabla y verificar:
   - Columnas correctas
   - RLS habilitado (ícono de candado verde)

### Ejecutar Query de Verificación

En SQL Editor, ejecutar:

```sql
-- Ver tablas creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_plans', 'feature_usage');

-- Ver políticas RLS
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_plans', 'feature_usage');
```

Deberías ver:
- 2 tablas
- 6 políticas RLS (3 por tabla)

---

## 🧪 Paso 3: Probar Localmente

El servidor ya está corriendo en: `http://127.0.0.1:3000`

### Test 1: Usuario NO logueado

1. Abrir navegador en modo incógnito
2. Ir a `http://127.0.0.1:3000`
3. Buscar cualquier botón de función premium
4. Click en el botón
5. **Resultado esperado:** Modal de "Inicia sesión para continuar"

### Test 2: Usuario FREE con límite

1. Iniciar sesión normalmente
2. Obtener tu UUID ejecutando en Supabase:
   ```sql
   SELECT auth.uid(), auth.email();
   ```
3. Simular límite alcanzado:
   ```sql
   INSERT INTO public.feature_usage (user_id, feature_key, period_start_date, used_count)
   VALUES ('TU-UUID-AQUI', 'ai_chat', date_trunc('week', CURRENT_DATE)::date, 20)
   ON CONFLICT (user_id, feature_key, period_start_date) DO UPDATE SET used_count = 20;
   ```
4. Intentar usar el chat
5. **Resultado esperado:** Modal de "Has agotado tus usos gratuitos"

### Test 3: Usuario PREMIUM

1. Convertir tu usuario a premium:
   ```sql
   INSERT INTO public.user_plans (user_id, tier)
   VALUES ('TU-UUID-AQUI', 'premium')
   ON CONFLICT (user_id) DO UPDATE SET tier = 'premium';
   ```
2. Intentar usar cualquier función
3. **Resultado esperado:** Acceso inmediato sin modales

---

## 🎯 Paso 4: Usar en Componentes

### Ejemplo Simple

```tsx
// En cualquier componente
import { OpenChatButton } from '@/components/premium-gates/OpenChatButton';

export default function MyPage() {
  return <OpenChatButton variant="primary" size="lg" />;
}
```

### Ejemplo con Hook

```tsx
'use client';
import { usePremiumFeatureGate } from '@/hooks/usePremiumFeatureGate';

export function MyFeature() {
  const { checking, checkAndRun } = usePremiumFeatureGate();

  const handleClick = () => {
    checkAndRun('ai_chat', async () => {
      // Tu lógica aquí
      console.log('¡Acción permitida!');
    });
  };

  return (
    <button onClick={handleClick} disabled={checking}>
      Usar función
    </button>
  );
}
```

---

## 🔧 Solución de Problemas

### Error: "relation does not exist"
**Causa:** La migración no se aplicó correctamente
**Solución:** Ejecutar nuevamente `INSTALACION_FREEMIUM.sql`

### Error: "RLS policy violation"
**Causa:** Políticas RLS no están activas
**Solución:** Verificar que RLS esté habilitado en ambas tablas

### Modal no aparece
**Causa:** Provider no está en layout
**Solución:** Ya está integrado en `src/app/layout.tsx`, verificar que no haya conflictos

### Contador no incrementa
**Causa:** Usuario no tiene sesión o problema con RLS
**Solución:** 
1. Verificar que `auth.uid()` retorna tu UUID
2. Revisar logs del endpoint `/api/feature-usage/use`

---

## 📊 Scripts Útiles

Todos los scripts están en: `SCRIPTS_PRUEBA_FREEMIUM.sql`

**Más usados:**
- Obtener mi UUID
- Convertir a premium/free
- Ver mis usos de la semana
- Resetear contadores
- Ver estadísticas globales

---

## 🚀 Deploy a Producción

1. Hacer push de cambios (ya hecho ✅):
   ```bash
   git push origin main
   ```

2. Vercel deployará automáticamente

3. **IMPORTANTE:** Aplicar la migración en Supabase de producción:
   - Mismo proceso que Paso 1
   - Usar el dashboard del proyecto de producción

---

## 📞 Soporte

Si algo no funciona:
1. Revisar consola del navegador (F12)
2. Revisar logs de Supabase (Database > Logs)
3. Revisar logs de Vercel (Dashboard > Logs)
4. Verificar variables de entorno en Vercel

---

## ✨ Funciones Disponibles

| Función | Límite FREE | Feature Key |
|---------|-------------|-------------|
| Chat con IA | 20/semana | `ai_chat` |
| Escáner | 30/semana | `barcode_scanner` |
| Detector | 30/semana | `food_detector` |
| Análisis nutricional | 15/semana | `nutrition_analysis` |
| Generador recetas | 10/semana | `recipe_generator` |
| Conversación voz | 10/semana | `voice_conversation` |
| Análisis imágenes | 20/semana | `image_analysis` |

Configurar en: `src/config/featureLimits.ts`

---

**Sistema desarrollado e instalado** ✅
**Fecha:** 10 de Diciembre, 2025
