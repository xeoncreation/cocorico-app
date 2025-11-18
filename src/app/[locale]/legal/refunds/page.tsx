import LegalLayout from "@/components/legal/LegalLayout";

export default function RefundsPage() {
  return (
    <LegalLayout title="Política de Reembolsos" updatedAt={new Date().toLocaleDateString("es-ES")}>
      <h2>1. Política General</h2>
      <p>
        En Cocorico valoramos tu satisfacción. Esta política describe las condiciones bajo las cuales puedes solicitar un reembolso de tu suscripción Premium.
      </p>

      <h2>2. Suscripción Premium (4,99 €/mes)</h2>
      
      <h3>2.1 Reembolso dentro de las primeras 48 horas</h3>
      <p>
        Si has contratado el plan Premium y no estás satisfecho/a con el servicio, puedes solicitar un reembolso completo dentro de las <strong>primeras 48 horas</strong> desde la fecha de tu primer pago.
      </p>
      <ul>
        <li>El reembolso se procesará en un plazo de 5-7 días hábiles</li>
        <li>Recibirás el importe íntegro en el método de pago original</li>
        <li>Tu cuenta volverá automáticamente al plan Gratuito</li>
      </ul>

      <h3>2.2 Después de las 48 horas</h3>
      <p>
        Pasado este periodo, <strong>no se realizan reembolsos por periodos parciales</strong>. Sin embargo:
      </p>
      <ul>
        <li>Puedes cancelar tu suscripción en cualquier momento desde "Configuración → Suscripción"</li>
        <li>Mantendrás acceso Premium hasta el final del periodo de facturación actual</li>
        <li>No se te cobrará en el siguiente ciclo</li>
      </ul>

      <h2>3. Excepciones y circunstancias especiales</h2>
      
      <h3>3.1 Problemas técnicos</h3>
      <p>
        Si experimentas problemas técnicos graves que impiden el uso del servicio durante más de 72 horas consecutivas, puedes solicitar:
      </p>
      <ul>
        <li>Reembolso proporcional del tiempo de inactividad</li>
        <li>Extensión gratuita de tu suscripción</li>
      </ul>
      <p>
        Debes notificarnos los problemas a través de{" "}
        <a href="mailto:support@cocorico.app" className="text-primary hover:underline">
          support@cocorico.app
        </a>{" "}
        para que podamos documentar y resolver el incidente.
      </p>

      <h3>3.2 Cargos duplicados o erróneos</h3>
      <p>
        Si detectas un cargo duplicado o erróneo en tu cuenta, contáctanos inmediatamente. Investigaremos y, de confirmarse el error, procesaremos el reembolso completo en un plazo de 3-5 días hábiles.
      </p>

      <h3>3.3 Suspensión o cierre de cuenta</h3>
      <p>
        Si tu cuenta es suspendida o cerrada por violar los{" "}
        <a href="/es/legal/terms" className="text-primary hover:underline">
          Términos de Servicio
        </a>
        , <strong>no tendrás derecho a reembolso</strong> por el periodo restante.
      </p>

      <h2>4. Cómo solicitar un reembolso</h2>
      <ol>
        <li>
          Envía un correo a{" "}
          <a href="mailto:refunds@cocorico.app" className="text-primary hover:underline font-semibold">
            refunds@cocorico.app
          </a>
        </li>
        <li>
          Incluye:
          <ul>
            <li>Tu dirección de correo electrónico de registro</li>
            <li>Fecha del cargo</li>
            <li>Motivo de la solicitud</li>
            <li>Si aplica, evidencia de problemas técnicos (capturas de pantalla, etc.)</li>
          </ul>
        </li>
        <li>Responderemos en un plazo de 48 horas laborables</li>
        <li>Si se aprueba, el reembolso se procesará en 5-7 días hábiles</li>
      </ol>

      <h2>5. Plataforma de pagos</h2>
      <p>
        Los pagos se procesan a través de <strong>Stripe</strong>. Si tienes dudas sobre un cargo:
      </p>
      <ul>
        <li>
          Consulta tu historial de pagos en{" "}
          <a href="https://dashboard.stripe.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            dashboard.stripe.com
          </a>
        </li>
        <li>
          Revisa la sección "Suscripción" en tu perfil de Cocorico
        </li>
        <li>
          Contáctanos en{" "}
          <a href="mailto:billing@cocorico.app" className="text-primary hover:underline">
            billing@cocorico.app
          </a>
        </li>
      </ul>

      <h2>6. Modificaciones de esta política</h2>
      <p>
        Nos reservamos el derecho de modificar esta Política de Reembolsos en cualquier momento. Los cambios entrarán en vigor inmediatamente tras su publicación. Te notificaremos por correo electrónico si realizamos cambios significativos.
      </p>

      <h2>7. Contacto</h2>
      <p>
        Para cualquier duda sobre reembolsos o facturación:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:refunds@cocorico.app" className="text-primary hover:underline">
            refunds@cocorico.app
          </a>
        </li>
        <li>
          <strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00 (CET)
        </li>
        <li>
          <strong>Tiempo de respuesta:</strong> Máximo 48 horas laborables
        </li>
      </ul>

      <div className="mt-8 p-4 glass-card glass-card-blue rounded-xl border">
        <p className="font-semibold mb-2">💡 Consejo</p>
        <p className="text-sm">
          Si tienes dudas sobre si Premium es para ti, aprovecha las primeras 48 horas para probar todas las funcionalidades sin compromiso. Queremos que estés 100% satisfecho/a con Cocorico.
        </p>
      </div>
    </LegalLayout>
  );
}
