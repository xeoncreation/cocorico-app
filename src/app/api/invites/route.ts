import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";
import { isAdmin } from "@/utils/authRole";

export async function POST(req: Request) {
  try {
    const { email, notes } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    if (!supabaseServer) {
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 });
    }

    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const adminCheck = await isAdmin(user.id);
    if (!adminCheck) {
      return NextResponse.json({ error: "No autorizado. Solo admins." }, { status: 403 });
    }

    const { data, error } = await supabaseServer
      .from("beta_invites")
      .insert({ email, invited_by: user.id, notes: notes || null })
      .select("token, email")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      token: data.token,
      email: data.email,
      inviteLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${data.token}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Error al crear invitación" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 500 });
    }

    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const adminCheck = await isAdmin(user.id);
    if (!adminCheck) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { data: invites, error } = await supabaseServer
      .from("beta_invites")
      .select("id, email, token, used, created_at, used_at, notes")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invites });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Error al obtener invitaciones" }, { status: 500 });
  }
}
