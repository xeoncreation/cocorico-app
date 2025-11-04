// @ts-nocheck - Las tablas se crearán al ejecutar la migración SQL
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const { data: { user } } = await supabaseServer!.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: sub } = await supabaseServer!
    .from('user_subscriptions').select('*').eq('user_id', user.id).maybeSingle();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 400 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`
  });

  return NextResponse.json({ url: portal.url });
}
