import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies | Cocorico',
  description: 'Información sobre las cookies que utiliza Cocorico',
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de Cookies</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. 
            Nos permiten recordar tus preferencias y mejorar tu experiencia.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies que utilizamos</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-semibold mb-2">🟢 Cookies estrictamente necesarias (siempre activas)</h3>
              <p className="mb-2">Imprescindibles para el funcionamiento del servicio. No requieren consentimiento.</p>
              
              <table className="w-full text-sm mt-4 border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Cookie</th>
                    <th className="text-left p-2">Propósito</th>
                    <th className="text-left p-2">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">sb-access-token</td>
                    <td className="p-2">Autenticación de sesión (Supabase)</td>
                    <td className="p-2">7 días</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">sb-refresh-token</td>
                    <td className="p-2">Renovación de sesión</td>
                    <td className="p-2">30 días</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">site_password</td>
                    <td className="p-2">Acceso durante fase beta privada</td>
                    <td className="p-2">7 días</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">invite</td>
                    <td className="p-2">Token de invitación beta</td>
                    <td className="p-2">24 horas</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">NEXT_LOCALE</td>
                    <td className="p-2">Idioma preferido</td>
                    <td className="p-2">1 año</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold mb-2">🔵 Cookies de funcionalidad</h3>
              <p className="mb-2">Recuerdan tus preferencias para mejorar la experiencia.</p>
              
              <table className="w-full text-sm mt-4 border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Cookie</th>
                    <th className="text-left p-2">Propósito</th>
                    <th className="text-left p-2">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">theme</td>
                    <td className="p-2">Tema visual (claro/oscuro)</td>
                    <td className="p-2">1 año</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">onboarding_completed</td>
                    <td className="p-2">Estado del tutorial inicial</td>
                    <td className="p-2">Permanente</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-mono text-xs">notifications_enabled</td>
                    <td className="p-2">Preferencia de notificaciones push</td>
                    <td className="p-2">1 año</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="text-xl font-semibold mb-2">🟡 Cookies analíticas (requieren consentimiento)</h3>
              <p className="mb-2">Nos ayudan a entender cómo usas Cocorico para mejorar el servicio.</p>
              
              <table className="w-full text-sm mt-4 border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Servicio</th>
                    <th className="text-left p-2">Propósito</th>
                    <th className="text-left p-2">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">Umami Analytics</td>
                    <td className="p-2">Estadísticas anónimas de uso (GDPR-friendly)</td>
                    <td className="p-2">1 año</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                ℹ️ Umami no usa cookies de terceros ni rastrea usuarios entre sitios. Es respetuoso con la privacidad.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies de terceros</h2>
          <p>Algunos servicios externos pueden establecer sus propias cookies:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Stripe:</strong> Para procesar pagos de forma segura
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                (Ver <a href="https://stripe.com/cookies-policy/legal" target="_blank" rel="noopener noreferrer" className="underline">política de Stripe</a>)
              </span>
            </li>
            <li>
              <strong>Vercel:</strong> Para mejorar el rendimiento y detectar errores
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                (Ver <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">política de Vercel</a>)
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Gestionar tus preferencias</h2>
          <p>Puedes controlar las cookies de varias formas:</p>
          
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">1. Panel de configuración de Cocorico</h3>
              <p className="text-sm">
                Ve a <a href="/settings/device" className="text-[#e43f30] underline">Configuración → Dispositivo</a> para activar/desactivar analíticas y notificaciones.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">2. Configuración de tu navegador</h3>
              <p className="text-sm mb-2">Puedes bloquear o eliminar cookies desde:</p>
              <ul className="text-sm list-disc pl-6 space-y-1">
                <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                <li><strong>Firefox:</strong> Preferencias → Privacidad y seguridad</li>
                <li><strong>Safari:</strong> Preferencias → Privacidad</li>
                <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio</li>
              </ul>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                ⚠️ Bloquear cookies necesarias impedirá iniciar sesión.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">3. Modo de navegación privada</h3>
              <p className="text-sm">
                Las cookies de sesión se eliminarán al cerrar la ventana. Tendrás que volver a iniciar sesión.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">LocalStorage y SessionStorage</h2>
          <p>
            Además de cookies, usamos tecnologías de almacenamiento local para:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Cachear recetas para acceso offline (PWA)</li>
            <li>Guardar borradores de chats no enviados</li>
            <li>Recordar preferencias de UI (vista de tarjetas/lista)</li>
          </ul>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Estos datos se almacenan solo en tu dispositivo y no se transmiten a nuestros servidores.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Actualizaciones de esta política</h2>
          <p>
            Si cambiamos significativamente las cookies que usamos, actualizaremos esta página y te notificaremos 
            mediante un banner en la aplicación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
          <p>
            Si tienes preguntas sobre cookies:<br />
            <a href="mailto:privacy@cocorico.app" className="text-[#e43f30] hover:underline font-medium">privacy@cocorico.app</a>
          </p>
        </section>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
          <p className="font-semibold mb-2">🍪 Resumen en 3 puntos</p>
          <ol className="text-sm space-y-1 list-decimal pl-6">
            <li>Usamos cookies necesarias para que funcione tu sesión</li>
            <li>Las analíticas son anónimas y opcionales (puedes desactivarlas)</li>
            <li>No vendemos tus datos a terceros ni hacemos tracking invasivo</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
