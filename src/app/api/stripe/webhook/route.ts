// @ts-nocheck - user_subscriptions and user_roles.plan column not yet in Database type; requires migration
import { getStripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = (await headers()).get("stripe-signature")!;
  const body = await req.text();

  try {
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    if (!supabaseServer) {
      console.error("supabaseServer no disponible");
      return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.user_id;
        
        if (!userId) {
          console.error("No user_id en metadata de checkout.session.completed");
          return NextResponse.json({ error: "No user_id" }, { status: 400 });
        }

        // Actualizar rol a pro_user en user_roles
        await supabaseServer
          .from("user_roles")
          .upsert({ user_id: userId, role: "pro_user" }, { onConflict: "user_id" });

        console.log(`✅ Usuario ${userId} actualizado a pro_user`);

        // (Opcional) También registrar en user_subscriptions si la tabla existe
        const customerId = session.customer as string;
        const subId = session.subscription as string;
        
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          
          await supabaseServer.from('user_subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subId,
            plan: 'pro',
            status: (sub as any).status,
            current_period_end: new Date(((sub as any).current_period_end as number) * 1000).toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const userId = sub.metadata?.user_id;

        if (!userId) {
          // Buscar por customer_id en user_subscriptions
          const customerId = sub.customer as string;
          const { data } = await supabaseServer
            .from('user_subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .maybeSingle();
          
          if (data?.user_id) {
            // Si la suscripción está activa, asegurar rol pro_user
            if (sub.status === "active") {
              await supabaseServer
                .from("user_roles")
                .upsert({ user_id: data.user_id, role: "pro_user" }, { onConflict: "user_id" });
            }

            await supabaseServer.from('user_subscriptions').update({
              status: sub.status,
              plan: sub.status === 'active' ? 'pro' : 'free',
              current_period_end: new Date((sub.current_period_end as number) * 1000).toISOString(),
              updated_at: new Date().toISOString()
            }).eq('user_id', data.user_id);

            console.log(`✅ Suscripción actualizada para usuario ${data.user_id}`);
          }
        } else {
          // user_id en metadata
          if (sub.status === "active") {
            await supabaseServer
              .from("user_roles")
              .upsert({ user_id: userId, role: "pro_user" }, { onConflict: "user_id" });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const userId = sub.metadata?.user_id;

        if (!userId) {
          // Buscar por customer_id
          const customerId = sub.customer as string;
          const { data } = await supabaseServer
            .from('user_subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .maybeSingle();
          
          if (data?.user_id) {
            // Revertir a rol user normal
            await supabaseServer
              .from("user_roles")
              .update({ role: "user" })
              .eq("user_id", data.user_id);

            await supabaseServer.from('user_subscriptions').update({
              status: sub.status,
              plan: 'free',
              updated_at: new Date().toISOString()
            }).eq('user_id', data.user_id);

            console.log(`❌ Usuario ${data.user_id} revertido a rol user (canceló suscripción)`);
          }
        } else {
          // user_id en metadata
          await supabaseServer
            .from("user_roles")
            .update({ role: "user" })
            .eq("user_id", userId);

          console.log(`❌ Usuario ${userId} revertido a rol user (canceló suscripción)`);
        }
        break;
      }

      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook error:", err.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
