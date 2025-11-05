# 💳 Guía de Migración: Stripe Test → Live

## ⚠️ Importante
Esta guía te ayudará a migrar de Stripe modo test a modo live cuando estés listo para **cobrar suscripciones reales**.

**No hacer esto hasta que:**
- [ ] Hayas completado Beta Privada (Fase 1)
- [ ] Tengas al menos 5-10 usuarios dispuestos a pagar
- [ ] Hayas probado el flujo completo de checkout en test mode
- [ ] Tengas páginas legales (`/legal/privacy`, `/legal/terms`) publicadas

---

## 📋 Checklist Pre-Migración

### 1. Verificación de cuenta Stripe
- [ ] Cuenta Stripe activada (no en modo restringido)
- [ ] Información bancaria completada (para recibir pagos)
- [ ] Verificación de identidad completada (si se requiere)
- [ ] País fiscal configurado (España u otro)

### 2. Configuración legal
- [ ] Política de privacidad publicada en `/legal/privacy`
- [ ] Términos de servicio publicados en `/legal/terms`
- [ ] Email de soporte configurado (ej: `soporte@cocorico.app`)
- [ ] Dirección fiscal válida (puede ser domicilio personal si eres autónomo)

### 3. Testing previo
- [ ] Checkout session funciona en test mode
- [ ] Webhook recibe eventos correctamente en test mode
- [ ] Cancellation flow probado
- [ ] Emails de confirmación (si los tienes) funcionan

---

## 🔄 Proceso de Migración

### Paso 1: Crear Producto Premium en Live Mode

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com)
2. **Arriba a la izquierda**: Desactiva "View test data" (cambia a Live)
3. Ve a **Products** → **Add product**
4. Configuración del producto:
   ```
   Name: Cocorico Premium
   Description: Chats ilimitados, visión en la nube, voz IA
   
   Pricing:
   - Model: Recurring
   - Price: 4,99 €
   - Billing period: Monthly
   - Currency: EUR
   ```
5. Haz clic en **Save product**
6. **Copia el Price ID** (empieza con `price_...`) → Lo necesitarás luego

### Paso 2: Configurar Webhook en Live Mode

1. En Stripe Dashboard (Live mode), ve a **Developers** → **Webhooks**
2. Haz clic en **Add endpoint**
3. Configuración:
   ```
   Endpoint URL: https://cocorico-app.vercel.app/api/stripe/webhook
   
   Events to send:
   ✅ checkout.session.completed
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ✅ invoice.payment_succeeded
   ✅ invoice.payment_failed
   ```
4. Haz clic en **Add endpoint**
5. **Copia el Signing Secret** (empieza con `whsec_...`)

### Paso 3: Obtener Claves Live

1. En Stripe Dashboard (Live mode), ve a **Developers** → **API keys**
2. Encontrarás:
   - **Publishable key** (pk_live_...) → Usada en frontend
   - **Secret key** (sk_live_...) → **¡MANTÉN SECRETA!**
3. Haz clic en "Reveal live key" para ver la Secret Key
4. Copia ambas claves en un lugar seguro (1Password, Bitwarden, etc.)

### Paso 4: Actualizar Variables en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona el proyecto **cocorico-app**
3. Ve a **Settings** → **Environment Variables**
4. Actualiza las siguientes variables:

   | Variable | Valor anterior (test) | Nuevo valor (live) |
   |----------|----------------------|---------------------|
   | `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_..._test` | `whsec_..._live` |
   | `STRIPE_PRICE_ID_PREMIUM` | `price_..._test` | `price_..._live` |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |

5. **Importante**: Asegúrate de seleccionar **Production** en el dropdown de environment
6. Haz clic en **Save** en cada variable

### Paso 5: Redeploy en Vercel

1. Ve a **Deployments** en Vercel
2. Haz clic en el último deployment exitoso
3. Haz clic en los **3 puntos** → **Redeploy**
4. Selecciona **Use existing Build Cache** (más rápido)
5. Espera a que termine el deploy (1-3 minutos)

### Paso 6: Verificación Post-Migración

#### Test manual del checkout
1. Abre `https://cocorico-app.vercel.app/pricing` en modo incógnito
2. Haz clic en **Suscribirse a Premium**
3. **Importante**: Stripe tiene tarjetas de prueba incluso en live mode:
   - Para probar SIN COBRAR: Usa `4242 4242 4242 4242` (test card, no funciona en live)
   - Para probar COBRANDO DE VERDAD: Usa tu tarjeta real (se cobrará 4,99 €)
4. Completa el checkout
5. Verifica que:
   - Te redirige a página de éxito
   - Recibes email de Stripe (si está configurado)
   - En `/dashboard` apareces como Premium
   - En Stripe Dashboard (Live) aparece el pago

#### Verificar webhook
1. En Stripe Dashboard (Live), ve a **Developers** → **Webhooks**
2. Haz clic en tu endpoint
3. Ve a **Events** → Deberías ver eventos recientes
4. Si ves ✅ verde, el webhook funciona
5. Si ves ❌ rojo, revisa logs en Vercel

---

## 🐛 Troubleshooting

### Error: "No such price"
- **Causa**: STRIPE_PRICE_ID_PREMIUM sigue apuntando al test mode
- **Solución**: Verifica que copiaste el `price_...` de Live mode, no test

### Webhook falla con 401
- **Causa**: STRIPE_WEBHOOK_SECRET incorrecto
- **Solución**: Recopia el signing secret del webhook en Live mode

### Checkout redirige pero no actualiza rol
- **Causa**: Webhook no llegó o falló
- **Solución**: 
  1. Revisa logs en Vercel: `https://vercel.com/[tu-usuario]/cocorico-app/logs`
  2. Busca errores en `/api/stripe/webhook`
  3. Verifica que RLS permite actualizar `user_roles`

### Usuario ya existe en Stripe (error duplicate customer)
- **Causa**: Email ya usado en test mode
- **Solución**: En checkout session, usa `customer_email` diferente o elimina customer en test mode

---

## 🔒 Seguridad Post-Migración

### Claves sensibles
- ✅ `sk_live_...` **NUNCA** debe aparecer en código frontend
- ✅ Solo en variables de entorno en Vercel
- ✅ No commitear `.env.local` con claves live

### Monitoreo
- [ ] Configurar alertas en Stripe para pagos fallidos
- [ ] Revisar dashboard diariamente los primeros 7 días
- [ ] Configurar notificaciones de webhook failures

### Backups
- [ ] Exportar clientes de Stripe semanalmente (CSV)
- [ ] Backup de Supabase (automático en plan Pro, manual en Free)

---

## 📊 Verificación de Costes

### Tarifas de Stripe
- **Cobro por transacción**: 1.5% + 0.25 € (Europa)
- **No hay fee mensual** (plan estándar)

### Ejemplo con 20 suscriptores
```
Ingresos: 20 × 4.99 € = 99.80 €
Fees Stripe: 20 × (4.99 × 1.5% + 0.25 €) = 20 × 0.32 € = 6.40 €
Ingresos netos: 93.40 €
```

### Costes de IA (estimado para 20 Premium)
```
OpenAI (chats): ~10 € (si cada usuario hace 50 chats/mes)
Replicate (visión): ~5 € (si cada usuario hace 10 scans/mes)
ElevenLabs (voz): ~8 € (si cada usuario usa 5 min/mes)
Total: ~23 €
```

### Margen estimado
```
Ingresos netos: 93.40 €
Costes IA: -23 €
Costes infra (Vercel + Supabase): -15 € (plan Pro)
Margen: 55.40 € (~56%)
```

**Punto de equilibrio**: ~15 suscriptores Premium

---

## ✅ Checklist Final

Antes de anunciar suscripciones:
- [ ] Stripe en Live mode configurado
- [ ] Variables de entorno actualizadas en Vercel
- [ ] Redeploy exitoso
- [ ] Test manual de checkout completado
- [ ] Webhook verificado (eventos llegan)
- [ ] Rol Premium se asigna correctamente
- [ ] Cancelación funciona (probar con cuenta test)
- [ ] Email de confirmación se envía (si aplica)
- [ ] Página `/pricing` actualizada
- [ ] Términos y privacidad publicados

---

## 📞 Soporte

Si algo falla:
1. **Revisa logs**: Vercel dashboard → Logs
2. **Stripe events**: Dashboard → Developers → Events
3. **Supabase logs**: Dashboard → Logs & Analytics
4. **Email Stripe Support**: support@stripe.com (responden en 24-48h)

---

## 🎉 ¡Listo!

Ahora Cocorico está cobrando suscripciones reales. 

**Siguientes pasos**:
1. Anunciar en comunidad que Premium ya está disponible
2. Monitorear primeras suscripciones de cerca
3. Recoger feedback de usuarios Premium
4. Iterar features exclusivas (voz IA, visión cloud, etc.)

---

**Fecha de migración sugerida**: Después de Beta Privada (Fase 1 completa)  
**Responsable**: Dev Team  
**Última actualización**: 5 de noviembre de 2025
