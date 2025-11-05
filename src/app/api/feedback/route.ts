import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
    }

    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { type, priority, title, description, email } = body;

    // Validar campos requeridos
    if (!type || !title || !description) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    // Insertar feedback en tabla
    const { error } = await supabaseServer.from('beta_feedback').insert({
      user_id: user.id,
      type,
      priority,
      title,
      description,
      contact_email: email || user.email,
      user_agent: request.headers.get('user-agent') || 'unknown',
      url: request.headers.get('referer') || '',
    });

    if (error) {
      console.error('Error insertando feedback:', error);
      return NextResponse.json({ error: 'Error al guardar feedback' }, { status: 500 });
    }

    // Opcional: Enviar notificación por email al equipo (usando Resend)
    // if (process.env.RESEND_API_KEY) {
    //   await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       from: 'Cocorico <feedback@cocorico.app>',
    //       to: 'dev@cocorico.app',
    //       subject: `[${priority.toUpperCase()}] Nuevo feedback: ${title}`,
    //       html: `
    //         <h2>Nuevo feedback de ${user.email}</h2>
    //         <p><strong>Tipo:</strong> ${type}</p>
    //         <p><strong>Prioridad:</strong> ${priority}</p>
    //         <p><strong>Título:</strong> ${title}</p>
    //         <p><strong>Descripción:</strong></p>
    //         <p>${description}</p>
    //       `,
    //     }),
    //   });
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en /api/feedback:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
