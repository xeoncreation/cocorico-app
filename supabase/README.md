# Supabase SQL

Ejecuta estos scripts en el SQL Editor de tu proyecto Supabase:

1. `sql/ai_and_limits.sql` — perfiles/threads/mensajes/cuota + RPC
2. `sql/stripe.sql` — tabla de suscripciones

Tras ejecutar, configura tus variables en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

En local, para webhooks:

```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
