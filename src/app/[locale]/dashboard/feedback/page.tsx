import FeedbackClient from "./feedback-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback | Cocorico",
  description: "Envía sugerencias, reporta errores y revisa el estado de tus tickets.",
};

export default function FeedbackPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <FeedbackClient />
    </main>
  );
}
  const t = useTranslations();
  const [feedback, setFeedback] = useState({
    type: 'bug',
    priority: 'medium',
    title: '',
    description: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      if (res.ok) {
        setSubmitted(true);
        trackEvent.errorEncountered('feedback_submitted', feedback.type);
        setTimeout(() => {
          setFeedback({ type: 'bug', priority: 'medium', title: '', description: '', email: '' });
          setSubmitted(false);
        }, 3000);
      } else {
        alert('Error al enviar feedback. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/80 via-white to-emerald-50/60 dark:from-green-950/20 dark:via-neutral-900 dark:to-emerald-950/20 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-green-900 dark:text-green-300">📝 Feedback Beta</h1>
          <p className="text-muted-foreground">
            Tu opinión es crucial para mejorar Cocorico. Reporta bugs, sugiere features o comparte tu experiencia.
          </p>
        </div>

      {submitted ? (
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-lg glass-card-premium">
          <h2 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">
            ✅ ¡Gracias por tu feedback!
          </h2>
          <p className="text-green-700 dark:text-green-300">
            Tu mensaje ha sido enviado. Lo revisaremos pronto.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl border border-green-200/60 bg-white/80 dark:bg-neutral-900/80 dark:border-green-800/40 glass-card-premium">
          <div>
            <label className="block text-sm font-medium mb-2">Tipo de feedback</label>
            <select
              aria-label="Tipo de feedback"
              value={feedback.type}
              onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-[#e43f30] outline-none"
              required
            >
              <option value="bug">🐛 Bug / Error</option>
              <option value="feature">💡 Sugerencia de feature</option>
              <option value="improvement">🚀 Mejora de UX</option>
              <option value="question">❓ Pregunta / Duda</option>
              <option value="other">📌 Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prioridad (opcional)</label>
            <select
              aria-label="Prioridad del feedback"
              value={feedback.priority}
              onChange={(e) => setFeedback({ ...feedback, priority: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-[#e43f30] outline-none"
            >
              <option value="low">🟢 Baja (cosmético)</option>
              <option value="medium">🟡 Media (afecta experiencia)</option>
              <option value="high">🟠 Alta (bloquea funcionalidad)</option>
              <option value="critical">🔴 Crítica (app inutilizable)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Título</label>
            <input
              type="text"
              value={feedback.title}
              onChange={(e) => setFeedback({ ...feedback, title: e.target.value })}
              placeholder="Ej: El botón de guardar receta no funciona en móvil"
              className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-[#e43f30] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={feedback.description}
              onChange={(e) => setFeedback({ ...feedback, description: e.target.value })}
              placeholder="Describe el problema o tu sugerencia con el mayor detalle posible. Si es un bug, incluye pasos para reproducirlo."
              rows={6}
              className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-[#e43f30] outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email (opcional)</label>
            <input
              type="email"
              value={feedback.email}
              onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
              placeholder="tu@email.com (si quieres que te contactemos)"
              className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-[#e43f30] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e43f30] hover:bg-[#c43525] text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar Feedback'}
          </button>
        </form>
      )}

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold mb-2">💬 Contacto directo</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            También puedes escribirnos a:<br />
            <a href="mailto:feedback@cocorico.app" className="text-[#e43f30] underline">
              feedback@cocorico.app
            </a>
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border-l-4 border-purple-500">
          <h3 className="font-semibold mb-2">🎁 Recompensas</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Los mejores feedbacks recibirán 1 mes de Premium gratis y aparecerán en los agradecimientos.
          </p>
        </div>
      </div>
    </div>
  );
}
