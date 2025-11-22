"use client";

import { useState, useEffect } from "react";
import SubscribeButton from "@/components/billing/SubscribeButton";
import { ChatMessage, ChatResponse } from "@/types/api";
import { validateMessage } from "@/utils/validation";
import CocoricoMascot, { useMascotMood } from "@/components/CocoricoMascot";

type Msg = Pick<ChatMessage, 'role' | 'content'>;

export default function ChatBox() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const { mood, setMood } = useMascotMood("default");

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
    setMood("thinking");

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
      setMood("happy", 3000);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error de red. Revisa tu conexión." },
      ]);
      setMood("alert", 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Mascot */}
      <div className="flex justify-center mb-4">
        <CocoricoMascot
          mood={mood}
          size="lg"
          animated
          showBubble={loading}
          bubbleText={loading ? "Cocorico está pensando..." : ""}
        />
      </div>

      <div className="border rounded-lg p-4 min-h-64 space-y-3 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
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
                  ? "bg-cocorico-red text-white dark:bg-amber-600"
                  : "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100")
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="animate-pulse text-xs text-neutral-500 dark:text-neutral-400">
              🐓 Cocorico está pensando…
            </div>
          </div>
        )}
        {errorCode === 429 && (
          <div className="rounded-lg border p-4 mt-3 bg-yellow-50">
            <p className="mb-3">Has usado tu límite diario gratuito. Pásate a <b>Premium</b> para uso ilimitado.</p>
            <SubscribeButton />
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 border border-neutral-200 dark:border-neutral-700 rounded px-3 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-base"
          placeholder="Escribe tu mensaje…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-cocorico-red hover:bg-cocorico-red/90 dark:bg-amber-600 dark:hover:bg-amber-700 text-white disabled:opacity-50 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
