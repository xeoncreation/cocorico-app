// @ts-nocheck - Las tablas se crearán al ejecutar la migración SQL
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature")!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const customerId = session.customer as string;
        // Busca user_id en metadata del customer
  const customer = await stripe.customers.retrieve(customerId);
        const userId = (customer as any).metadata?.user_id as string | undefined;

        if (userId) {
          // Recupera la subscription id
          const subId = session.subscription as string;
          const sub = await stripe.subscriptions.retrieve(subId);

          await supabaseServer!.from('user_subscriptions').upsert({
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

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
  const sub = event.data.object as any;
        const customerId = sub.customer as string;
        // localizar user por customerId
        const { data } = await supabaseServer!
          .from('user_subscriptions').select('user_id').eq('stripe_customer_id', customerId).maybeSingle();
        if (data?.user_id) {
          await supabaseServer!.from('user_subscriptions').update({
            status: sub.status,
            plan: sub.status === 'active' ? 'pro' : 'free',
            current_period_end: new Date((sub.current_period_end as number) * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }).eq('user_id', data.user_id);
        }
        break;
      }
      default:
        // ignora otros eventos
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook error:", err.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
