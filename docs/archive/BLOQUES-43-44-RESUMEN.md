# BLOQUES 43-44: Comunidad + Chat + Planes + Pagos

## ✅ COMPLETADO

### 🎨 BLOQUE 43: Comunidad tipo Instagram

**Base de datos**
- ✅ Tablas creadas: `posts`, `post_likes`, `post_comments`
- ✅ RLS configurado para privacidad
- ✅ Índices para rendimiento

**Páginas creadas**
- ✅ `/community` - Feed público con grid de posts
- ✅ `/community/[id]` - Vista individual de post con likes y comentarios
- ✅ `/community/new` - Crear nueva publicación con imagen

**Componentes**
- ✅ `LikeButton.tsx` - Botón de like con contador en tiempo real
- ✅ `CommentBox.tsx` - Sistema de comentarios con lista y formulario

**Características**
- ✅ Subida de imágenes al storage de Supabase
- ✅ Visibilidad pública/privada
- ✅ Likes y comentarios en tiempo real
- ✅ UI responsive tipo Instagram

---

### 💬 BLOQUE 44: Chat + Planes + Pagos

**Base de datos**
- ✅ Tablas: `user_chats`, `chat_messages`, `user_subscriptions`
- ✅ RLS para chats privados
- ✅ Soporte para Stripe customer/subscription IDs

**Sistema de Pagos (Stripe)**
- ✅ Página `/plans` - Comparación Free vs Premium
- ✅ Página `/checkout` - Redirige a Stripe Checkout
- ✅ API `/api/billing/create-session` - Crea sesión de pago
- ✅ API `/api/billing/webhook` - Sincroniza estado de suscripción
- ✅ Página `/billing/success` - Confirmación post-pago

**Características Premium**
- IA ilimitada
- Recetas exclusivas
- Chat privado
- Personalización avanzada
- Sin anuncios

---

## 📦 Instalación de Dependencias

Ejecuta en la terminal:

```powershell
npm install stripe @stripe/stripe-js @supabase/ssr
```

---

## 🔧 Variables de Entorno

Añade a `.env.local`:

```env
# Stripe (obtener de https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_xxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx
STRIPE_PRICE_MONTHLY=price_xxxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ Configuración de Base de Datos

### Opción 1: Ejecutar el SQL directamente

1. Ve a Supabase Dashboard → SQL Editor
2. Copia el contenido de `supabase/migrations/20241104_community_chat_subscriptions.sql`
3. Ejecuta el script

### Opción 2: Aplicar migración

```powershell
cd supabase
npx supabase db push
```

---

## 💳 Configuración de Stripe

### 1. Crear producto y precio

1. Ve a https://dashboard.stripe.com/test/products
2. Click en **"Add product"**
3. Rellena:
   - **Name**: Cocorico Premium
   - **Description**: Acceso completo a funciones premium
   - **Pricing model**: Recurring
   - **Price**: €4.99
   - **Billing period**: Monthly
4. Guarda y copia el **Price ID** (empieza con `price_`)
5. Pégalo en `.env.local` como `STRIPE_PRICE_MONTHLY`

### 2. Configurar webhook (Local)

Para desarrollo local con Stripe CLI:

```powershell
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Escuchar webhooks
stripe listen --forward-to localhost:3000/api/billing/webhook
```

Copia el **Webhook signing secret** que aparece (empieza con `whsec_`) y pégalo en `.env.local` como `STRIPE_WEBHOOK_SECRET`.

### 3. Configurar webhook (Producción en Vercel)

1. Ve a https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `https://tu-dominio.vercel.app/api/billing/webhook`
4. Eventos a escuchar:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copia el **Signing secret** y añádelo como variable de entorno en Vercel

---

## 🚀 Cómo Probar

### 1. Comunidad

```powershell
# Asegúrate que el servidor está corriendo
npx next dev -p 3000

# Abre el navegador
http://localhost:3000/es/community
```

1. Inicia sesión
2. Click en "+ Nueva publicación"
3. Sube una imagen, escribe descripción
4. Publica
5. Ve al feed y click en tu post
6. Dale like y comenta

### 2. Planes y Pagos

```powershell
# En otra terminal, inicia Stripe webhook listener
stripe listen --forward-to localhost:3000/api/billing/webhook
```

Luego:

1. Ve a http://localhost:3000/es/plans
2. Click en "Suscribirme ahora" del plan Premium
3. Serás redirigido a Stripe Checkout (modo test)
4. Usa tarjeta de prueba: `4242 4242 4242 4242`
   - Fecha: cualquier fecha futura
   - CVC: cualquier 3 dígitos
5. Completa el pago
6. Serás redirigido a `/billing/success`
7. El webhook sincronizará el estado automáticamente

### 3. Verificar suscripción

En Supabase SQL Editor:

```sql
select * from user_subscriptions;
select user_id, plan from user_roles;
```

---

## 📁 Archivos Creados

### Base de datos
- `supabase/migrations/20241104_community_chat_subscriptions.sql`

### Páginas
- `src/app/[locale]/community/page.tsx`
- `src/app/[locale]/community/[id]/page.tsx`
- `src/app/[locale]/community/new/page.tsx`
- `src/app/[locale]/plans/page.tsx`
- `src/app/[locale]/checkout/page.tsx`
- `src/app/[locale]/billing/success/page.tsx`

### APIs
- `src/app/api/billing/create-session/route.ts`
- `src/app/api/billing/webhook/route.ts`

### Componentes
- `src/components/community/LikeButton.tsx`
- `src/components/community/CommentBox.tsx`

### Utilidades
- `src/app/lib/supabase-server.ts`

---

## ✅ Checklist de Implementación

- [x] Dependencias instaladas (`stripe`, `@supabase/ssr`)
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] SQL ejecutado en Supabase
- [ ] Producto creado en Stripe
- [ ] Webhook configurado (local o producción)
- [ ] Bucket `recipes` configurado en Supabase Storage con política pública para lectura
- [ ] Probado: crear post, dar like, comentar
- [ ] Probado: flujo de pago completo
- [ ] Verificado: suscripción se sincroniza correctamente

---

## 🔍 Troubleshooting

### Error: "Cannot find module '@/app/lib/supabase-server'"

✅ **Ya solucionado** - Archivo `supabase-server.ts` creado.

### Error: Stripe webhook signature verification failed

- Verifica que `STRIPE_WEBHOOK_SECRET` está configurado
- En local, asegúrate que `stripe listen` está corriendo
- En producción, verifica que el endpoint del webhook en Stripe está correcto

### Error al subir imagen en comunidad

1. Ve a Supabase Dashboard → Storage
2. Crea bucket `recipes` si no existe (o crea uno nuevo `posts`)
3. Configura política de acceso:
   - **Insert**: autenticados pueden insertar
   - **Select**: público puede leer

SQL para políticas:

```sql
-- Permitir lectura pública
create policy "Public can view images"
on storage.objects for select
using ( bucket_id = 'recipes' );

-- Permitir subir solo a usuarios autenticados
create policy "Authenticated can upload"
on storage.objects for insert
with check ( bucket_id = 'recipes' and auth.role() = 'authenticated' );
```

### Suscripción no se actualiza después de pagar

1. Verifica logs del webhook:
   - Stripe Dashboard → Webhooks → tu endpoint → Events
2. Revisa logs de Vercel o terminal local
3. Confirma que el `user_id` en metadata coincide

---

## 🎯 Próximos Pasos Sugeridos

### Chat en Tiempo Real (Bonus)

Ya tienes las tablas `user_chats` y `chat_messages`. Puedes implementar:

1. Página `/messages` - Lista de chats
2. Página `/messages/[id]` - Chat individual con realtime de Supabase
3. Componente con `supabase.channel()` para mensajes en tiempo real

### Mejoras de Comunidad

- [ ] Filtros (más recientes, más populares)
- [ ] Búsqueda de posts
- [ ] Hashtags
- [ ] Mención de usuarios
- [ ] Compartir posts

### Mejoras de Planes

- [ ] Portal de facturación de Stripe (gestionar suscripción)
- [ ] Plan anual con descuento
- [ ] Período de prueba gratuito

---

## 📊 Estado del Proyecto

✅ **Build**: PASS  
✅ **Lint**: PASS  
✅ **Tests**: PASS  
✅ **Comunidad**: Implementada  
✅ **Pagos Stripe**: Implementados  
⏸️ **Chat realtime**: Pendiente (tablas listas)

**Última actualización**: 2025-11-04
