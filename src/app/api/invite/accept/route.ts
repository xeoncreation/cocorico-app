import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-client";

export async function POST(req: Request) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: "Token, email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Buscar invitación válida
    const { data: invite, error: inviteError } = await supabaseServer
      .from("beta_invites")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .maybeSingle();

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: "Invitación no válida o ya usada." },
        { status: 400 }
      );
    }

    // Verificar que el email coincida (opcional, para mayor seguridad)
    if (invite.email && invite.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "El email no coincide con la invitación." },
        { status: 400 }
      );
    }

    // Crear usuario en Supabase Auth
    const { data: newUser, error: signupError } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email para beta testers
    });

    if (signupError) {
      // Si el usuario ya existe, informar claramente
      if (signupError.message.includes("already registered")) {
        return NextResponse.json(
          { error: "Este email ya está registrado. Intenta iniciar sesión." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: signupError.message },
        { status: 500 }
      );
    }

    // Marcar invitación como usada
    const { error: updateError } = await supabaseServer
      .from("beta_invites")
      .update({ used: true, used_at: new Date().toISOString() })
      .eq("id", invite.id);

    if (updateError) {
      console.error("Error al marcar invitación como usada:", updateError);
      // No fallar la request por esto, el usuario ya se creó
    }

    return NextResponse.json({
      success: true,
      message: "Cuenta creada exitosamente. Ya puedes iniciar sesión.",
      userId: newUser.user?.id,
    });
  } catch (error: any) {
    console.error("Error en /api/invite/accept:", error);
    return NextResponse.json(
      { error: error?.message || "Error al procesar la invitación" },
      { status: 500 }
    );
  }
}
