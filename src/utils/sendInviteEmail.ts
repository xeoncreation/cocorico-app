/**
 * Utilidad para enviar emails de invitación automáticos usando Resend.
 * Requiere: npm install resend
 * Configura RESEND_API_KEY en .env.local
 */

// @ts-ignore - instalar con: npm install resend
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface InviteEmailParams {
  to: string;
  token: string;
  inviterName?: string;
  notes?: string;
}

export async function sendInviteEmail({
  to,
  token,
  inviterName = "el equipo de Cocorico",
  notes,
}: InviteEmailParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteLink = `${baseUrl}/invite/${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Cocorico 🐓 <beta@cocorico.app>",
      to,
      subject: "Tu invitación a Cocorico Beta",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ea580c; text-align: center;">🐓 Cocorico</h1>
          <h2 style="color: #292524;">¡Has sido invitado a nuestra beta privada!</h2>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Hola,
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            ${inviterName} te ha invitado a participar en la <strong>beta cerrada</strong> de Cocorico,
            tu asistente de cocina con inteligencia artificial.
          </p>
          
          ${notes ? `<p style="font-size: 14px; color: #57534e; font-style: italic;">"${notes}"</p>` : ""}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background-color: #ea580c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Aceptar invitación
            </a>
          </div>
          
          <p style="font-size: 14px; color: #57534e;">
            O copia y pega este enlace en tu navegador:<br>
            <a href="${inviteLink}" style="color: #ea580c;">${inviteLink}</a>
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e7e5e4;">
          
          <p style="font-size: 12px; color: #78716c; text-align: center;">
            Si no esperabas este correo, puedes ignorarlo de forma segura.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error al enviar email de invitación:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error en sendInviteEmail:", error);
    return { success: false, error };
  }
}
