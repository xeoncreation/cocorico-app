# Configuración de Stripe para Cocorico Premium

Este documento explica cómo configurar Stripe para procesar pagos premium en Cocorico.

## Variables de Entorno Requeridas

Añade estas variables a tu archivo `.env.local`:

```bash
# Stripe Keys (obtener desde https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Service Role (para webhook)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Configuración Paso a Paso

### 1. Crear Cuenta en Stripe

1. Ve a [stripe.com](https://stripe.com) y crea una cuenta
2. Completa el onboarding básico
3. Activa el modo test

### 2. Obtener API Keys

1. Ve a [Dashboard > Developers > API keys](https://dashboard.stripe.com/test/apikeys)
2. Copia la **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Revela y copia la **Secret key** → `STRIPE_SECRET_KEY`

### 3. Configurar Webhook

1. Ve a [Dashboard > Developers > Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click en "Add endpoint"
3. URL del endpoint: `https://tu-dominio.vercel.app/api/stripe/webhook`
   - Para desarrollo local usa ngrok: `https://abc123.ngrok.io/api/stripe/webhook`
4. Selecciona estos eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.deleted` (opcional, para futuras suscripciones)
5. Click en "Add endpoint"
6. Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 4. Ejecutar Migraciones de Supabase

```bash
# Conectar a tu proyecto Supabase
npx supabase link --project-ref tu-proyecto-id

# Ejecutar migraciones
npx supabase db push

# O manualmente en el SQL Editor de Supabase:
# - supabase/migrations/20240116_premium_status.sql
```

### 5. Configurar Producto en Stripe

1. Ve a [Dashboard > Products](https://dashboard.stripe.com/test/products)
2. Click en "Add product"
3. Nombre: "Cocorico Premium - Anual"
4. Precio: $49.99 USD (one-time payment)
5. Guarda el producto

**Nota:** El código actualmente usa Payment Intents para pagos únicos. Si prefieres suscripciones recurrentes, necesitarás modificar el código para usar Subscriptions API.

## Testing en Local con ngrok

Para probar webhooks en desarrollo local:

```bash
# Instalar ngrok
npm install -g ngrok

# Exponer puerto 3000
ngrok http 3000

# Usar la URL generada (https://abc123.ngrok.io) en Stripe webhook
```

## Flujo de Pago

1. Usuario hace click en "Upgrade a Premium" → `/es/premium`
2. Click en "Mejorar a Premium" → `/es/checkout`
3. Frontend crea Payment Intent → `POST /api/stripe/create-payment-intent`
4. Usuario completa pago en Stripe Elements
5. Stripe envía webhook → `POST /api/stripe/webhook`
6. Webhook actualiza `profiles.is_premium = true`
7. Usuario es redirigido a → `/es/checkout/success`
8. ¡Usuario ahora es Premium! 🎉

## Componentes Creados

### Frontend
- `/app/[locale]/checkout/page.tsx` - Página de pago con Stripe Elements
- `/app/[locale]/checkout/success/page.tsx` - Confirmación de pago exitoso
- `/components/premium/PremiumGate.tsx` - Componente para proteger features
- `/hooks/usePremiumStatus.ts` - Hook para verificar status premium

### Backend
- `/api/stripe/create-payment-intent/route.ts` - Crea Payment Intent
- `/api/stripe/webhook/route.ts` - Maneja eventos de Stripe (ya existía)

### Database
- `supabase/migrations/20240116_premium_status.sql` - Añade campos premium

## Uso de PremiumGate

```tsx
import PremiumGate from "@/components/premium/PremiumGate";

// Proteger una página completa
export default function AIRecipeGeneratorPage() {
  return (
    <PremiumGate featureName="Generador de Recetas con IA">
      <AIRecipeGenerator />
    </PremiumGate>
  );
}

// Proteger una sección específica
<PremiumGate featureName="Chat Premium" showUpgrade={true}>
  <PremiumChatRooms />
</PremiumGate>

// Mostrar contenido alternativo
<PremiumGate
  featureName="Escaneo HD"
  fallback={<BasicScanner />}
>
  <HDScanner />
</PremiumGate>
```

## Uso del Hook

```tsx
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

function MyComponent() {
  const { isPremium, loading, expiresAt, refreshStatus } = usePremiumStatus();

  if (loading) return <Spinner />;

  return (
    <div>
      {isPremium ? (
        <PremiumFeature />
      ) : (
        <UpgradeCTA />
      )}
    </div>
  );
}
```

## Precios Recomendados

- **Premium Anual:** $49.99 USD/año (~$4.17/mes)
- **Premium Mensual:** $9.99 USD/mes (implementar suscripciones)
- **Lifetime:** $149.99 USD (one-time, `premium_expires_at = NULL`)

## Testing

### Test Cards de Stripe

```
Pago exitoso: 4242 4242 4242 4242
Pago rechazado: 4000 0000 0000 0002
Requiere 3D Secure: 4000 0027 6000 3184

Cualquier CVC, cualquier fecha futura
```

### Verificar Status Premium

```sql
-- En Supabase SQL Editor
SELECT id, email, is_premium, premium_since, premium_expires_at
FROM profiles
WHERE is_premium = true;
```

### Ver Transacciones

```sql
SELECT t.*, p.email
FROM transactions t
JOIN auth.users u ON t.user_id = u.id
JOIN profiles p ON p.id = u.id
ORDER BY t.created_at DESC
LIMIT 10;
```

## Troubleshooting

### Webhook no funciona

1. Verifica que `STRIPE_WEBHOOK_SECRET` esté correcto
2. Revisa logs en Stripe Dashboard > Webhooks
3. Confirma que la URL es accesible públicamente
4. Verifica que `SUPABASE_SERVICE_ROLE_KEY` esté configurado

### Usuario pagó pero no es premium

1. Revisa logs del webhook en Stripe Dashboard
2. Verifica que el webhook tenga el evento `payment_intent.succeeded`
3. Consulta la tabla `transactions` para ver si se registró
4. Manualmente actualiza el usuario:

```sql
UPDATE profiles
SET is_premium = true,
    premium_since = NOW(),
    premium_expires_at = NOW() + INTERVAL '1 year'
WHERE id = 'user-uuid-aqui';
```

## Próximos Pasos

1. **Implementar Subscripciones:** Cambiar de Payment Intents a Subscriptions API
2. **Email Notifications:** Enviar emails de bienvenida/confirmación con Resend
3. **Admin Dashboard:** Panel para ver usuarios premium y transacciones
4. **Coupons/Discounts:** Códigos promocionales con Stripe Coupons
5. **Cancel/Refund:** Permitir cancelaciones y reembolsos desde la app

## Recursos

- [Stripe API Docs](https://stripe.com/docs/api)
- [Stripe Elements](https://stripe.com/docs/stripe-js)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Testing](https://stripe.com/docs/testing)
