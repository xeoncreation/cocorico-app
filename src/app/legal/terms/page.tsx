export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Términos de Servicio</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Aceptación de términos</h2>
          <p>
            Al acceder y usar Cocorico, aceptas estos Términos de Servicio y nuestra Política de Privacidad. 
            Si no estás de acuerdo, no uses el servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Descripción del servicio</h2>
          <p>
            Cocorico es un asistente de cocina potenciado por inteligencia artificial que te ayuda a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Generar recetas personalizadas</li>
            <li>Identificar ingredientes mediante visión IA</li>
            <li>Chatear con un asistente culinario</li>
            <li>Organizar tu libro de recetas digital</li>
            <li>Completar retos diarios de cocina</li>
            <li>Participar en una comunidad de cocineros</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Registro y cuenta</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Debes tener al menos 16 años para usar Cocorico</li>
            <li>Debes proporcionar información veraz y actualizada</li>
            <li>Eres responsable de mantener segura tu contraseña</li>
            <li>Una persona, una cuenta (no compartir credenciales)</li>
            <li>Nos reservamos el derecho de suspender cuentas que violen estos términos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Planes y suscripciones</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Plan Gratuito</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>10 chats con IA por mes</li>
            <li>5 recetas guardadas</li>
            <li>Visión local (TensorFlow.js)</li>
            <li>Acceso a la comunidad</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Plan Premium (4,99 €/mes)</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Chats y recetas ilimitados</li>
            <li>Visión en la nube (Replicate, mayor precisión)</li>
            <li>Narrador de voz IA (ElevenLabs)</li>
            <li>Acceso a features beta</li>
            <li>Sin anuncios</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Facturación</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pagos procesados por Stripe</li>
            <li>Facturación mensual automática</li>
            <li>Puedes cancelar en cualquier momento desde "Configuración → Suscripción"</li>
            <li>No hay reembolsos por periodos parciales</li>
            <li>Al cancelar, mantienes acceso Premium hasta fin de periodo</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Uso aceptable</h2>
          <p className="font-semibold mb-2">Está prohibido:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Usar el servicio para fines ilegales</li>
            <li>Intentar acceder a cuentas de otros usuarios</li>
            <li>Hacer scraping o recopilación automatizada de datos</li>
            <li>Sobrecargar los servidores con solicitudes excesivas</li>
            <li>Subir contenido ofensivo, violento o sexual</li>
            <li>Compartir recetas con derechos de autor sin permiso</li>
            <li>Revender o redistribuir el servicio</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contenido generado por IA</h2>
          <p>
            Las recetas y respuestas generadas por IA son sugerencias. Cocorico no garantiza:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Que las recetas sean nutricionalmente equilibradas</li>
            <li>Que los ingredientes identificados sean 100% precisos</li>
            <li>Que las recetas se adapten a alergias o intolerancias sin verificación</li>
          </ul>
          <p className="mt-4 font-semibold">
            ⚠️ Si tienes alergias severas, siempre verifica los ingredientes antes de consumir.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Propiedad intelectual</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Tu contenido:</strong> Recetas que crees manualmente son tuyas. Puedes exportarlas.</li>
            <li><strong>Recetas IA:</strong> Las recetas generadas por IA pueden ser similares a otras. No reclamamos propiedad exclusiva.</li>
            <li><strong>Nuestra plataforma:</strong> El código, diseño, marca "Cocorico" y mascota son de nuestra propiedad.</li>
            <li><strong>Licencia de uso:</strong> Te otorgamos una licencia personal, no comercial, revocable para usar Cocorico.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitación de responsabilidad</h2>
          <p>
            Cocorico se proporciona "tal cual". No nos hacemos responsables de:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Problemas de salud derivados de seguir recetas</li>
            <li>Errores en identificación de ingredientes</li>
            <li>Interrupciones del servicio</li>
            <li>Pérdida de datos (aunque hacemos backups regulares)</li>
            <li>Daños indirectos o lucro cesante</li>
          </ul>
          <p className="mt-4">
            Nuestra responsabilidad total se limita al importe pagado en los últimos 12 meses.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Modificaciones del servicio</h2>
          <p>
            Podemos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Añadir, modificar o eliminar funcionalidades</li>
            <li>Cambiar precios con 30 días de antelación</li>
            <li>Suspender temporalmente el servicio para mantenimiento</li>
            <li>Actualizar estos términos (notificaremos cambios importantes)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Terminación</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Por tu parte:</strong> Puedes eliminar tu cuenta en "Configuración"</li>
            <li><strong>Por nuestra parte:</strong> Podemos suspender cuentas que violen los términos</li>
            <li>Al terminar, tus datos se eliminarán según la Política de Privacidad</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos se rigen por la legislación española. Cualquier disputa se resolverá en los juzgados de [Tu Ciudad].
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contacto</h2>
          <p>
            Para consultas sobre estos términos:<br />
            <a href="mailto:legal@cocorico.app" className="text-[#e43f30] hover:underline font-medium">legal@cocorico.app</a>
          </p>
        </section>

        <div className="mt-12 p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-[#e43f30]">
          <p className="font-semibold mb-2">🍳 ¡Buen provecho!</p>
          <p className="text-sm">
            Al usar Cocorico, aceptas cocinar con responsabilidad, experimentar con alegría y compartir tus mejores recetas con la comunidad.
          </p>
        </div>
      </div>
    </div>
  );
}
