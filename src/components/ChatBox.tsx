"use client";

import { useState } from "react";
import SubscribeButton from "@/components/billing/SubscribeButton";
import { ChatMessage, ChatResponse } from "@/types/api";
import { validateMessage } from "@/utils/validation";

type Msg = Pick<ChatMessage, 'role' | 'content'>;

export default function ChatBox() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateMessage(input);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const userMsg: Msg = { role: "user", content: validation.value! };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: validation.value }),
      });

      if (res.status === 429) {
        setErrorCode(429);
      }
      const json = await res.json() as ChatResponse;
      const assistantMsg: Msg = {
        role: "assistant",
        content: json.answer || "Hubo un error. Inténtalo otra vez.",
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error de red. Revisa tu conexión." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="border rounded-lg p-4 min-h-64 space-y-3 bg-white">
        {messages.length === 0 && (
          <p className="text-sm text-neutral-500">
            Escribe tu duda (por ejemplo “¿Este producto es ultraprocesado?” o “Ideas para cenar con brócoli”)
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                "inline-block px-3 py-2 rounded-lg " +
                (m.role === "user"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-900")
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && <p className="text-xs text-neutral-500">Cocorico está pensando…</p>}
        {errorCode === 429 && (
          <div className="rounded-lg border p-4 mt-3 bg-yellow-50">
            <p className="mb-3">Has usado tu límite diario gratuito. Pásate a <b>Premium</b> para uso ilimitado.</p>
            <SubscribeButton />
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Escribe tu mensaje…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
