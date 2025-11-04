export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Política de Privacidad</h1>
      <p>Esta app (Cocorico) trata datos mínimos necesarios para su funcionamiento.</p>
      <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-2">
        <li>Autenticación: correo electrónico para iniciar sesión.</li>
        <li>Recetas: guardamos los textos que subes y su visibilidad.</li>
        <li>Mensajería: almacenamos tus mensajes del chat con la IA en tu cuenta.</li>
        <li>Analítica: anónima y sin cookies siempre que sea posible (Umami).</li>
      </ul>
      <p className="text-sm text-neutral-600">
        Puedes solicitar la eliminación de tus datos escribiendo a nuestro soporte.
      </p>
      <p className="text-xs text-neutral-500">Última actualización: {new Date().toLocaleDateString()}</p>
    </main>
  );
}
