// @ts-nocheck - Las tablas se crearán al ejecutar la migración SQL
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/app/lib/supabase-server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new NextResponse("No signature", { status: 400 });
  }

  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("⚠️  Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Manejar eventos de suscripción
  try {
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;

      if (userId) {
        // @ts-ignore - current_period_end existe pero TypeScript puede no reconocerlo
        const periodEnd = subscription.current_period_end || Math.floor(Date.now() / 1000);
        
        await supabaseServer()
          .from("user_subscriptions")
          .upsert(
            {
              user_id: userId,
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              current_period_end: new Date(periodEnd * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        // Actualizar plan en user_roles si existe
        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";
        const plan = isActive ? "premium" : "free";

        await supabaseServer()
          .from("user_roles")
          .upsert(
            { user_id: userId, plan },
            { onConflict: "user_id", ignoreDuplicates: false }
          );

        console.log(
          `✅ Subscription ${subscription.id} updated for user ${userId}: ${subscription.status}`
        );
      }
    }

    // Manejar eventos de pago
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`✅ Payment succeeded for invoice ${invoice.id}`);
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`❌ Payment failed for invoice ${invoice.id}`);
    }
  } catch (e: any) {
    console.error("❌ Webhook handler error:", e);
    return new NextResponse("Server error", { status: 500 });
  }

  return new NextResponse("OK", { status: 200 });
}
