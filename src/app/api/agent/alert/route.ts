export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { event, analysis } = await req.json();
    
    // Verificar que tenemos las variables de entorno necesarias
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const DEV_EMAIL = process.env.DEV_EMAIL || 'xeontheconcept@gmail.com';
    
    if (!RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY no configurada. Email no enviado.');
      return Response.json({ 
        success: false, 
        error: 'RESEND_API_KEY no configurada' 
      }, { status: 500 });
    }

    // Crear HTML simple sin usar React Email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">🚨 Alerta del Agente IA - Cocorico</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Detección automática de error crítico</p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
            <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #ef4444;">
              <h2 style="margin-top: 0; color: #ef4444;">📍 Información del Error</h2>
              <p><strong>Severidad:</strong> <span style="background: #dc2626; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${analysis.severity.toUpperCase()}</span></p>
              <p><strong>Mensaje:</strong> ${event.message}</p>
              <p><strong>URL:</strong> ${event.url}</p>
              <p><strong>Timestamp:</strong> ${new Date(event.timestamp).toLocaleString('es-ES')}</p>
            </div>

            <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #2563eb;">
              <h2 style="margin-top: 0; color: #2563eb;">🤖 Análisis del Agente IA</h2>
              <p>${analysis.analysis}</p>
            </div>

            <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #16a34a;">
              <h2 style="margin-top: 0; color: #16a34a;">💡 Causas Posibles</h2>
              <ul>
                ${analysis.possibleCauses.map((cause: string) => `<li>${cause}</li>`).join('')}
              </ul>
            </div>

            <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #9333ea;">
              <h2 style="margin-top: 0; color: #9333ea;">🔧 Solución Sugerida</h2>
              <p>${analysis.suggestedFix}</p>
            </div>

            ${event.stack ? `
            <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 8px;">
              <h2 style="margin-top: 0;">📋 Stack Trace</h2>
              <pre style="background: #1f2937; color: #f3f4f6; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 12px;">${event.stack}</pre>
            </div>
            ` : ''}
          </div>

          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>Este mensaje fue generado automáticamente por el Agente IA de Cocorico</p>
          </div>
        </body>
      </html>
    `;

    // Usar fetch directamente para enviar el email vía API de Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Agente IA Cocorico <onboarding@resend.dev>',
        to: DEV_EMAIL,
        subject: `🚨 [${analysis.severity.toUpperCase()}] ${event.message.substring(0, 50)}...`,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to send alert email:', data);
      return Response.json({ success: false, error: data }, { status: 500 });
    }

    console.log('✅ Alert email sent:', data);
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Error in agent alert:', error);
    return Response.json(
      { error: 'Failed to send alert' },
      { status: 500 }
    );
  }
}
