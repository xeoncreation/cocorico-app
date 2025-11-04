// @ts-nocheck - Las tablas se crearán al ejecutar la migración SQL
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: 'Faltan variables de entorno de Supabase' },
      { status: 500 }
    );
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json(
      { error: 'Falta NEXT_PUBLIC_APP_URL para return_url del portal' },
      { status: 500 }
    );
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from('user_billing')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (!data?.stripe_customer_id)
    return NextResponse.json({ error: 'No stripe customer' }, { status: 400 });

  const portal = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
  });

  return NextResponse.json({ url: portal.url });
}
