// @ts-nocheck - Las tablas se crearán al ejecutar la migración SQL
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const { data: { user } } = await supabaseServer!.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  // busca/crea customer
  const { data: sub } = await supabaseServer!.from('user_subscriptions').select('*').eq('user_id', user.id).maybeSingle();
  let customerId = sub?.stripe_customer_id as string | undefined;

  if (!customerId) {
  const customer = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { user_id: user.id }
    });
    customerId = customer.id;
    await supabaseServer!.from('user_subscriptions').upsert({ user_id: user.id, stripe_customer_id: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?status=cancel`,
    allow_promotion_codes: true
  });

  return NextResponse.json({ url: session.url });
}
