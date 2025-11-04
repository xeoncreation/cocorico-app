# 🎯 INSTRUCCIONES FINALES - BLOQUES 43-44

## ⚠️ IMPORTANTE: Sigue estos pasos en orden

Los errores de TypeScript que ves son normales porque las tablas aún no existen en tu base de datos. Al ejecutar el SQL de migración, todo se solucionará.

---

## 📋 PASO 1: Ejecutar el SQL en Supabase

### Opción A: Desde el Dashboard (RECOMENDADO)

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Click en **SQL Editor** en el menú lateral
3. Click en **New query**
4. Abre el archivo `supabase/migrations/20241104_community_chat_subscriptions.sql`
5. **COPIA TODO EL CONTENIDO** y pégalo en el editor
6. Click en **Run** (▶️)
7. Deberías ver: `Success. No rows returned`

### Opción B: Desde la terminal (alternativa)

```powershell
# Asegúrate de tener Supabase CLI instalado
npx supabase db push
```

---

## 📋 PASO 2: Configurar Stripe

### 2.1 Obtener las API keys

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copia la **Publishable key** (empieza con `pk_test_`)
3. Copia la **Secret key** (empieza con `sk_test_`) - Click en "Reveal test key"

### 2.2 Crear el producto Premium

1. Ve a [Products](https://dashboard.stripe.com/test/products)
2. Click **Add product**
3. Rellena:
   - **Name**: `Cocorico Premium`
   - **Description**: `Acceso completo a todas las funciones premium`
   - **Pricing model**: `Recurring`
   - **Price**: `4.99` EUR
   - **Billing period**: `Monthly`
4. Click **Save product**
5. **IMPORTANTE**: Copia el **Price ID** (empieza con `price_xxxxx`)

---

## 📋 PASO 3: Configurar variables de entorno

Crea el archivo `.env.local` si no existe, o añade estas líneas:

```env
# Supabase (ya deberías tener estas)
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# Stripe - PEGA TUS VALORES AQUÍ
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_PRICE_MONTHLY=price_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ NO COMPARTAS ESTAS CLAVES NUNCA**

---

## 📋 PASO 4: Configurar el webhook de Stripe

### Para desarrollo local

1. **Instala Stripe CLI** si no lo tienes:
   - Windows: https://github.com/stripe/stripe-cli/releases/latest
   - Descarga `stripe_X.X.X_windows_x86_64.zip`
   - Extrae y añade al PATH

2. **Inicia sesión**:
   ```powershell
   stripe login
   ```

3. **Escucha webhooks**:
   ```powershell
   stripe listen --forward-to localhost:3000/api/billing/webhook
   ```

4. **Copia el webhook secret** que aparece (empieza con `whsec_`) y pégalo en `.env.local` como `STRIPE_WEBHOOK_SECRET`

### Para producción (Vercel)

1. Ve a [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. **Endpoint URL**: `https://tu-dominio.vercel.app/api/billing/webhook`
4. **Events to send**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copia el **Signing secret** y añádelo como variable de entorno en Vercel

---

## 📋 PASO 5: Configurar Storage en Supabase

Para que funcione la subida de imágenes en la comunidad:

1. Ve a [Storage](https://supabase.com/dashboard/project/_/storage/buckets) en Supabase
2. El bucket `recipes` debería existir ya
3. Click en `recipes` → **Policies**
4. Asegúrate de tener estas políticas:

**Política 1: Lectura pública**
```sql
create policy "Public can view images"
on storage.objects for select
using ( bucket_id = 'recipes' );
```

**Política 2: Subida autenticada**
```sql
create policy "Authenticated can upload"
on storage.objects for insert
with check ( bucket_id = 'recipes' and auth.role() = 'authenticated' );
```

Si no existen, ve a **SQL Editor** y ejecuta estas dos queries.

---

## 📋 PASO 6: Regenerar tipos de Supabase

Después de ejecutar el SQL, regenera los tipos de TypeScript:

```powershell
npx supabase gen types typescript --project-id TU_PROJECT_ID > src/types/supabase.ts
```

Reemplaza `TU_PROJECT_ID` con tu ID de proyecto (lo encuentras en Settings → General).

O usa esta forma alternativa:

```powershell
npx supabase gen types typescript --db-url "postgresql://postgres:[TU_PASSWORD]@db.[TU_REF].supabase.co:5432/postgres" > src/types/supabase.ts
```

---

## 📋 PASO 7: Reinicia el servidor

```powershell
# Detén el servidor actual (Ctrl+C)

# Inicia de nuevo
npx next dev -p 3000
```

---

## 🧪 PASO 8: Probar todo

### 8.1 Probar la Comunidad

1. Abre http://localhost:3000/es/community
2. Click en **"+ Nueva publicación"**
3. Sube una imagen (JPG, PNG, WebP < 5MB)
4. Escribe una descripción
5. Selecciona visibilidad (Pública/Privada)
6. Click **Publicar**
7. Ve al feed y verifica que aparece
8. Click en tu post → Dale like → Comenta

### 8.2 Probar Planes y Pagos

1. **Terminal 1**: Asegúrate de que `stripe listen` está corriendo
   ```powershell
   stripe listen --forward-to localhost:3000/api/billing/webhook
   ```

2. **Terminal 2**: El servidor Next.js
   ```powershell
   npx next dev -p 3000
   ```

3. **Navegador**:
   - Ve a http://localhost:3000/es/plans
   - Click en **"Suscribirme ahora"** del plan Premium
   - Serás redirigido a Stripe Checkout
   - Usa tarjeta de prueba:
     - Número: `4242 4242 4242 4242`
     - Fecha: Cualquier futura (ej: `12/30`)
     - CVC: `123`
     - Nombre: Tu nombre
     - Email: Tu email
   - Click **Subscribe**
   - Deberías volver a `/billing/success` con mensaje de éxito

4. **Verificar suscripción**:
   - Ve a Supabase → SQL Editor
   - Ejecuta:
     ```sql
     select * from user_subscriptions;
     select user_id, plan from user_roles;
     ```
   - Deberías ver tu suscripción con `status = 'active'` y `plan = 'premium'`

---

## ✅ Checklist Final

Marca cuando hayas completado cada paso:

- [ ] SQL ejecutado en Supabase (tablas creadas)
- [ ] Producto y precio creados en Stripe
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Webhook de Stripe configurado (local o producción)
- [ ] Storage bucket `recipes` con políticas configuradas
- [ ] Tipos de Supabase regenerados
- [ ] Servidor reiniciado
- [ ] Probado: crear post, like, comentar
- [ ] Probado: flujo de pago completo Free → Premium
- [ ] Verificado: suscripción sincronizada en base de datos

---

## 🐛 Problemas Comunes

### Error: "Cannot find module '@supabase/ssr'"

**Solución**: Ya instalado, pero reinicia VS Code:
```powershell
# Cierra VS Code y abre de nuevo, o ejecuta:
# Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Error: tabla "posts" no existe

**Solución**: No has ejecutado el SQL del PASO 1.

### Error: Stripe webhook signature verification failed

**Solución:**

1. Verifica que `STRIPE_WEBHOOK_SECRET` en `.env.local` coincide con el de `stripe listen`
2. Reinicia el servidor Next.js después de cambiar `.env.local`

### Error al subir imagen: "new row violates row-level security"

**Solución**: Ejecuta las políticas de storage del PASO 5.

### No puedo pagar: "No such price: price_xxx"

**Solución**: Verifica que `STRIPE_PRICE_MONTHLY` en `.env.local` coincide exactamente con el Price ID de Stripe.

### La suscripción no aparece en la BD después de pagar

**Solución**:
1. Verifica que `stripe listen` está corriendo en otra terminal
2. Revisa los logs en la terminal de `stripe listen` para ver los eventos
3. Revisa los logs del servidor Next.js por errores en el webhook

---

## 📚 Archivos Importantes

- **Migración**: `supabase/migrations/20241104_community_chat_subscriptions.sql`
- **Resumen**: `BLOQUES-43-44-RESUMEN.md`
- **Variables de entorno**: `.env.local` (créalo si no existe)
- **Tipos de Supabase**: `src/types/supabase.ts`

---

## 🎉 Listo

Una vez completados todos los pasos, tendrás:

✅ Feed de comunidad tipo Instagram con likes y comentarios  
✅ Sistema de publicaciones con imágenes  
✅ Planes Free y Premium  
✅ Pagos con Stripe totalmente funcionales  
✅ Sincronización automática de suscripciones  
✅ Gestión de usuarios premium

---

## 🚀 Próximos Pasos Opcionales

### Chat en Tiempo Real

Las tablas `user_chats` y `chat_messages` ya están creadas. Puedes implementar:

- Página `/messages` - Lista de conversaciones
- Página `/messages/[id]` - Chat 1-a-1 con realtime

### Portal de Facturación

Permite a usuarios gestionar su suscripción (cancelar, actualizar tarjeta):

```typescript
// src/app/api/billing/portal/route.ts
const session = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
});
```

---

**¿Problemas?** Revisa la sección de Troubleshooting en `BLOQUES-43-44-RESUMEN.md`
