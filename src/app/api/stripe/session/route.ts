import Stripe from "stripe";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-10-29.clover",
    });
    if (!supabaseServer) {
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 });
    }

    const { data: { user } } = await supabaseServer.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (!process.env.STRIPE_PRICE_ID_PREMIUM) {
      return NextResponse.json({ error: "STRIPE_PRICE_ID_PREMIUM no configurado" }, { status: 500 });
    }

    const successUrl = process.env.STRIPE_SUCCESS_URL || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    const cancelUrl = process.env.STRIPE_CANCEL_URL || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email!,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID_PREMIUM,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe session error:", err);
    return NextResponse.json({ error: err.message || "Error creando sesión de pago" }, { status: 500 });
  }
}
