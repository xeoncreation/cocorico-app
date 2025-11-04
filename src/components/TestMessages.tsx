import { messageService } from "@/services/messages";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase-client";
import type { Database } from "@/types/supabase";

type Message = Database['public']['Tables']['messages']['Row'];

export default function TestMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState("");

  const loadMessages = useCallback(async () => {
    try {
      const messages = await messageService.getMessages();
      setMessages(messages);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessage.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) {
        throw new Error('Debes iniciar sesión para enviar mensajes');
      }

      await messageService.insertMessage({
        content: testMessage,
        role: 'user',
        user_id: session.data.session.user.id
      });

      setTestMessage("");
      await loadMessages(); // Recargar mensajes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje');
    } finally {
      setLoading(false);
    }
  };

  if (loading && messages.length === 0) {
    return <div className="p-4">Cargando mensajes...</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Prueba de Mensajes</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Escribe un mensaje de prueba"
            className="flex-1 px-3 py-2 border rounded"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500">No hay mensajes aún</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded ${
                msg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
              }`}
            >
              <div className="text-sm text-gray-600 mb-1">
                {msg.role === 'user' ? 'Usuario' : 'Asistente'}
              </div>
              <div>{msg.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}