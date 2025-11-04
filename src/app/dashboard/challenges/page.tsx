"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  reward_xp: number;
  active_date: string;
}

export default function ChallengesPage() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchChallenge();
  }, []);

  async function fetchChallenge() {
    try {
      const res = await fetch("/api/challenge/today");
      if (res.ok) {
        const data = await res.json();
        setChallenge(data);
      }
    } catch (err) {
      console.error("Error cargando reto:", err);
    } finally {
      setLoading(false);
    }
  }

  async function completeChallenge() {
    if (!challenge) return;
    setCompleting(true);

    try {
      // Marcar reto como completado
      await fetch("/api/gamify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "challenge_completed" }),
      });

      alert(`¡Reto completado! +${challenge.reward_xp} XP 🎉`);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error completando reto:", err);
      alert("Error al completar el reto");
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">Cargando reto del día...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">
          No hay reto disponible hoy. ¡Vuelve mañana!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          Reto del día 🔥
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Completa este desafío y gana {challenge.reward_xp} XP
        </p>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-neutral-900 dark:to-neutral-800 p-8 rounded-2xl shadow-lg border border-orange-200 dark:border-neutral-700">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {challenge.difficulty === "easy" ? "Fácil" : challenge.difficulty === "hard" ? "Difícil" : "Normal"}
          </span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {new Date(challenge.active_date).toLocaleDateString("es-ES", { 
              weekday: "long", 
              day: "numeric", 
              month: "long" 
            })}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          {challenge.title}
        </h2>

        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
          {challenge.description}
        </p>

        <div className="flex gap-3">
          <button
            onClick={completeChallenge}
            disabled={completing}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {completing ? "Completando..." : "¡He completado este reto! 🎉"}
          </button>
          <a
            href="/dashboard"
            className="px-6 py-3 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            Volver
          </a>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <p>💡 Completa retos diarios para ganar XP extra y subir de nivel más rápido</p>
      </div>
    </div>
  );
}
