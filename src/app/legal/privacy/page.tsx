export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Responsable del tratamiento</h2>
          <p>
            <strong>Cocorico</strong> es un servicio operado por [Tu Nombre/Empresa] con domicilio en [Dirección].<br />
            Email de contacto: <a href="mailto:privacy@cocorico.app" className="text-[#e43f30] hover:underline">privacy@cocorico.app</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Datos que recopilamos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Datos de cuenta:</strong> Email, nombre de usuario, contraseña cifrada</li>
            <li><strong>Datos de uso:</strong> Recetas guardadas, chats con IA, retos completados, logros</li>
            <li><strong>Datos de pago:</strong> Procesados por Stripe (no almacenamos datos bancarios)</li>
            <li><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, cookies de sesión</li>
            <li><strong>Datos opcionales:</strong> Fotos de ingredientes (procesadas con IA, no almacenadas)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Finalidad del tratamiento</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proporcionar el servicio de asistente de cocina con IA</li>
            <li>Gestionar suscripciones y facturación</li>
            <li>Personalizar la experiencia del usuario</li>
            <li>Enviar notificaciones sobre retos diarios y actualizaciones</li>
            <li>Mejorar el servicio mediante análisis de uso</li>
            <li>Cumplir obligaciones legales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Base legal</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Ejecución de contrato:</strong> Datos necesarios para el servicio</li>
            <li><strong>Consentimiento:</strong> Cookies analíticas, notificaciones push</li>
            <li><strong>Interés legítimo:</strong> Mejora del servicio, seguridad</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Destinatarios de los datos</h2>
          <p>Compartimos datos únicamente con:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Supabase:</strong> Hosting de base de datos (UE)</li>
            <li><strong>Vercel:</strong> Hosting de aplicación (UE/US)</li>
            <li><strong>Stripe:</strong> Procesamiento de pagos</li>
            <li><strong>OpenAI / Replicate:</strong> APIs de IA (solo datos enviados en consultas)</li>
            <li><strong>Umami:</strong> Analíticas anónimas (opcional)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Conservación de datos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cuenta activa:</strong> Mientras uses el servicio</li>
            <li><strong>Cuenta eliminada:</strong> 30 días para recuperación, luego borrado permanente</li>
            <li><strong>Datos de facturación:</strong> 7 años (obligación legal)</li>
            <li><strong>Logs de seguridad:</strong> 90 días</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Tus derechos (GDPR)</h2>
          <p>Puedes ejercer los siguientes derechos contactando a <a href="mailto:privacy@cocorico.app" className="text-[#e43f30] hover:underline">privacy@cocorico.app</a>:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Acceso:</strong> Solicitar copia de tus datos</li>
            <li><strong>Rectificación:</strong> Corregir datos incorrectos</li>
            <li><strong>Supresión:</strong> Eliminar tu cuenta y datos</li>
            <li><strong>Portabilidad:</strong> Exportar tus recetas en JSON</li>
            <li><strong>Oposición:</strong> Rechazar procesamiento para fines específicos</li>
            <li><strong>Limitación:</strong> Restringir el tratamiento</li>
          </ul>
          <p className="mt-4">
            También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Seguridad</h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger tus datos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cifrado HTTPS/TLS en todas las comunicaciones</li>
            <li>Contraseñas hasheadas con bcrypt</li>
            <li>Row Level Security (RLS) en base de datos</li>
            <li>Autenticación con tokens seguros (JWT)</li>
            <li>Rate limiting en APIs</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Menores de edad</h2>
          <p>
            Cocorico no está dirigido a menores de 16 años. Si eres padre/tutor y descubres que tu hijo ha proporcionado datos, contacta con nosotros para eliminarlos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política. Te notificaremos cambios significativos por email o mediante aviso en la aplicación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contacto</h2>
          <p>
            Para cualquier consulta sobre privacidad:<br />
            <a href="mailto:privacy@cocorico.app" className="text-[#e43f30] hover:underline font-medium">privacy@cocorico.app</a>
          </p>
        </section>
      </div>
    </div>
  );
}
