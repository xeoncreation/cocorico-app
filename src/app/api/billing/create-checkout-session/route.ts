import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const { userId, email } = await req.json() as { userId: string; email: string };

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Faltan variables de entorno de Supabase' },
        { status: 500 }
      );
    }
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: 'Falta NEXT_PUBLIC_APP_URL para URLs de retorno' },
        { status: 500 }
      );
    }
    const priceEnv = process.env.STRIPE_PRICE_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY;
    if (!priceEnv || !priceEnv.startsWith('price_')) {
      return NextResponse.json(
        { error: 'Falta STRIPE_PRICE_MONTHLY (price_...) o valor inválido' },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: billing } = await supabase
      .from('user_billing').select('stripe_customer_id')
      .eq('user_id', userId).single();

    let customerId = billing?.stripe_customer_id;
    if (!customerId) {
  const customer = await stripe.customers.create({
        email, metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
      await supabase
        .from('user_billing')
        .upsert({ user_id: userId, stripe_customer_id: customerId }, { onConflict: 'user_id' });
    }

  const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceEnv, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
      client_reference_id: userId,
      subscription_data: { metadata: { supabase_user_id: userId } },
    });

    return NextResponse.json({ url: session.url });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

async function subscribe(userId: string, email: string) {
  const r = await fetch('/api/billing/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, email }),
  });
  const { url, error } = await r.json();
  if (error) { alert(error); return; }
  if (url) window.location.href = url;
}
