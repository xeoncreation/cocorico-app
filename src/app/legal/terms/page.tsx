export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Términos de Servicio</h1>
      <p className="text-sm text-neutral-700">
        Cocorico es una herramienta educativa. No sustituye consejo médico ni nutricional profesional.
      </p>
      <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-2">
        <li>El contenido generado por IA es orientativo.</li>
        <li>No nos hacemos responsables de decisiones basadas únicamente en la app.</li>
        <li>Respeta la propiedad intelectual al compartir recetas públicas.</li>
      </ul>
      <p className="text-xs text-neutral-500">Última actualización: {new Date().toLocaleDateString()}</p>
    </main>
  );
}
