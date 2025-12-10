# Sistema de Control de Acceso Premium (Freemium)

Sistema completo de navegación condicionada por login y bloqueo de funciones premium por contador semanal de usos gratuitos.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Componentes del Sistema](#componentes-del-sistema)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso Básico](#uso-básico)
- [API Reference](#api-reference)
- [Ejemplos](#ejemplos)
- [Testing](#testing)

## 🎯 Descripción

Este sistema implementa tres niveles de control de acceso:

### 1. Usuario NO logueado
- Puede navegar libremente por la app
- Al intentar usar una función premium → **Modal de login/registro**

### 2. Usuario logueado (Plan FREE)
- Cada función tiene un límite semanal (configurable)
- Se registra cada uso en la base de datos
- Al alcanzar el límite → **Modal de "límite agotado"**

### 3. Usuario logueado (Plan PREMIUM)
- Sin límites (o límites muy altos)
- Nunca ve modales de bloqueo

## 🏗️ Componentes del Sistema

### Base de Datos (Supabase)

**Migración:** `supabase/migrations/20251210_user_plans_and_feature_usage.sql`

Tablas creadas:
- `user_plans`: Plan actual del usuario (free/premium)
- `feature_usage`: Contadores de uso por usuario/función/semana

### Configuración

**Archivo:** `src/config/featureLimits.ts`

Define los límites semanales para cada función:

```typescript
export const FREE_WEEKLY_LIMITS = {
  ai_chat: 20,              // 20 chats IA por semana
  barcode_scanner: 30,      // 30 escaneos por semana
  food_detector: 30,        // 30 detecciones por semana
  nutrition_analysis: 15,   // 15 análisis nutricionales
  recipe_generator: 10,     // 10 recetas generadas
  voice_conversation: 10,   // 10 conversaciones de voz
  image_analysis: 20,       // 20 análisis de imágenes
};
```

### API Route

**Endpoint:** `POST /api/feature-usage/use`

**Body:**
```json
{
  "featureKey": "ai_chat"
}
```

**Respuesta (éxito):**
```json
{
  "allowed": true,
  "tier": "free",
  "used": 5,
  "remaining": 15,
  "limit": 20
}
```

**Respuesta (límite alcanzado):**
```json
{
  "allowed": false,
  "tier": "free",
  "used": 20,
  "remaining": 0,
  "limit": 20,
  "error": "limit_reached",
  "message": "Has agotado tus usos gratuitos..."
}
```

### Contexto Global

**Archivo:** `src/contexts/AuthGateModalContext.tsx`

Gestiona los modales emergentes:
- Modal de login (usuario no autenticado)
- Modal de límite agotado (usuario free sin usos)

### Hook Principal

**Archivo:** `src/hooks/usePremiumFeatureGate.ts`

Hook para controlar acceso a funciones premium:

```typescript
const { checking, checkAndRun } = usePremiumFeatureGate();
```

### Helpers

**Archivo:** `src/lib/feature-usage/period.ts`

Funciones para calcular períodos semanales:
- `getCurrentWeekStartDate()`: Lunes de la semana actual
- `getNextRenewalDate()`: Fecha legible del próximo lunes
- `getDaysUntilRenewal()`: Días hasta renovación

## 🚀 Instalación y Configuración

### 1. Aplicar Migración en Supabase

```bash
# En el Dashboard de Supabase, ir a SQL Editor y ejecutar:
supabase/migrations/20251210_user_plans_and_feature_usage.sql
```

O desde CLI:
```bash
supabase db push
```

### 2. Verificar Variables de Entorno

Asegúrate de tener en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. El sistema ya está integrado

El `AuthGateModalProvider` ya está envuelto en `src/app/layout.tsx`, por lo que está disponible en toda la app.

## 💡 Uso Básico

### Opción 1: Usar componentes pre-construidos

```tsx
import { OpenChatButton } from '@/components/premium-gates/OpenChatButton';
import { OpenScannerButton } from '@/components/premium-gates/OpenScannerButton';

export default function HomePage() {
  return (
    <div>
      <OpenChatButton variant="primary" size="lg" />
      <OpenScannerButton variant="secondary" />
    </div>
  );
}
```

### Opción 2: Usar el hook directamente

```tsx
'use client';

import { usePremiumFeatureGate } from '@/hooks/usePremiumFeatureGate';
import { useRouter } from 'next/navigation';

export function MyComponent() {
  const router = useRouter();
  const { checking, checkAndRun } = usePremiumFeatureGate();

  const handleAction = () => {
    checkAndRun('ai_chat', async () => {
      // Esta función solo se ejecuta si está permitido
      router.push('/chat');
    });
  };

  return (
    <button onClick={handleAction} disabled={checking}>
      {checking ? 'Verificando...' : 'Abrir Chat'}
    </button>
  );
}
```

### Opción 3: Componente genérico reutilizable

```tsx
import { PremiumActionButton } from '@/components/premium-gates/PremiumActionButton';

export function NutritionAnalyzer() {
  const handleAnalyze = async () => {
    // Tu lógica de análisis
    const result = await analyzeFood(image);
    console.log(result);
  };

  return (
    <PremiumActionButton
      featureKey="nutrition_analysis"
      onAllowed={handleAnalyze}
      className="bg-blue-600 text-white"
    >
      Analizar Nutrición
    </PremiumActionButton>
  );
}
```

## 📚 API Reference

### Hook: `usePremiumFeatureGate()`

```typescript
const { checking, checkAndRun, checkOnly } = usePremiumFeatureGate();
```

**Retorna:**
- `checking: boolean` - Estado de verificación en curso
- `checkAndRun(featureKey, action)` - Verifica y ejecuta si permitido
- `checkOnly(featureKey)` - Solo verifica, sin ejecutar acción

### Contexto: `useAuthGateModal()`

```typescript
const { showLoginRequired, showLimitReached, close } = useAuthGateModal();
```

**Métodos:**
- `showLoginRequired(featureKey?)` - Muestra modal de login
- `showLimitReached({ featureKey, remaining, limit })` - Muestra modal de límite
- `close()` - Cierra el modal

### Tipos

```typescript
type FeatureKey = 
  | 'ai_chat'
  | 'barcode_scanner'
  | 'food_detector'
  | 'nutrition_analysis'
  | 'recipe_generator'
  | 'voice_conversation'
  | 'image_analysis';

type PlanTier = 'free' | 'premium';
```

## 🎨 Ejemplos Completos

### Ejemplo 1: Proteger un formulario de análisis

```tsx
'use client';

import { usePremiumFeatureGate } from '@/hooks/usePremiumFeatureGate';
import { useState } from 'react';

export function FoodAnalysisForm() {
  const { checking, checkAndRun } = usePremiumFeatureGate();
  const [result, setResult] = useState(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    checkAndRun('food_detector', async () => {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" />
      <button type="submit" disabled={checking}>
        {checking ? 'Verificando acceso...' : 'Analizar'}
      </button>
      {result && <div>{JSON.stringify(result)}</div>}
    </form>
  );
}
```

### Ejemplo 2: Link protegido con feedback visual

```tsx
'use client';

import { usePremiumFeatureGate } from '@/hooks/usePremiumFeatureGate';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export function ProtectedLink({ href, children, featureKey }) {
  const router = useRouter();
  const { checking, checkAndRun } = usePremiumFeatureGate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    checkAndRun(featureKey, () => {
      router.push(href);
    });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="flex items-center gap-2 hover:text-orange-600 transition"
    >
      {checking && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </a>
  );
}
```

### Ejemplo 3: Actualizar contador en tiempo real

```tsx
'use client';

import { usePremiumFeatureGate } from '@/hooks/usePremiumFeatureGate';
import { useEffect, useState } from 'react';

export function UsageCounter({ featureKey }) {
  const { checkOnly } = usePremiumFeatureGate();
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    // Verificar uso actual sin consumir
    const fetchUsage = async () => {
      const data = await checkOnly(featureKey);
      setUsage(data);
    };
    fetchUsage();
  }, [featureKey]);

  if (!usage || usage.tier === 'premium') return null;

  return (
    <div className="text-sm text-neutral-600">
      Usos esta semana: {usage.used} / {usage.limit}
      ({usage.remaining} restantes)
    </div>
  );
}
```

## 🧪 Testing

### Simular usuario Premium

En Supabase SQL Editor:

```sql
-- Convertir usuario a premium
INSERT INTO public.user_plans (user_id, tier)
VALUES ('uuid-del-usuario', 'premium')
ON CONFLICT (user_id) DO UPDATE SET tier = 'premium';
```

### Resetear contadores de un usuario

```sql
-- Borrar contadores de esta semana
DELETE FROM public.feature_usage
WHERE user_id = 'uuid-del-usuario'
  AND period_start_date = '2025-12-08'; -- Lunes de la semana actual
```

### Simular límite alcanzado

```sql
-- Establecer contador al límite
INSERT INTO public.feature_usage (user_id, feature_key, period_start_date, used_count)
VALUES ('uuid-del-usuario', 'ai_chat', '2025-12-08', 20)
ON CONFLICT (user_id, feature_key, period_start_date) 
DO UPDATE SET used_count = 20;
```

## 📝 Agregar Nueva Función Premium

1. **Añadir en configuración**

```typescript
// src/config/featureLimits.ts
export const FREE_WEEKLY_LIMITS = {
  // ... existentes
  mi_nueva_funcion: 15, // 15 usos por semana
};
```

2. **Actualizar tipos**

```typescript
export type FeatureKey = 
  | 'ai_chat'
  | 'mi_nueva_funcion'; // ← Añadir aquí
```

3. **Usar en componente**

```tsx
import { usePremiumFeatureGate } from '@/hooks/usePremiumFeatureGate';

export function MiNuevaFuncion() {
  const { checkAndRun } = usePremiumFeatureGate();

  const handleClick = () => {
    checkAndRun('mi_nueva_funcion', async () => {
      // Tu lógica aquí
    });
  };

  return <button onClick={handleClick}>Usar función</button>;
}
```

## 🔧 Troubleshooting

### Modal no aparece
- Verificar que `AuthGateModalProvider` esté en `layout.tsx`
- Verificar que el componente tenga `'use client'`
- Revisar consola del navegador

### Contador no incrementa
- Verificar que la migración SQL se haya aplicado
- Verificar RLS policies en Supabase
- Revisar logs del endpoint `/api/feature-usage/use`

### Usuario siempre bloqueado
- Verificar que el usuario esté autenticado
- Revisar tabla `user_plans` (puede no tener fila = default free)
- Verificar que `featureKey` coincida exactamente con `FREE_WEEKLY_LIMITS`

## 🎯 Próximos Pasos

- [ ] Integrar con Stripe para actualizar `user_plans.tier` automáticamente
- [ ] Añadir página de estadísticas de uso para usuarios
- [ ] Implementar notificaciones cuando quedan pocos usos
- [ ] Dashboard admin para ver uso global de funciones
- [ ] Sistema de referidos para ganar usos extra

---

**Desarrollado para Cocorico App** | Diciembre 2025
