"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RippleButton } from "@/components/ui/ripple-button";

type Props = { locale: string; initialProfile?: { goal?: string | null; diet?: string | null } };

export default function OnboardingClient({ locale, initialProfile }: Props) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState(initialProfile?.goal ?? "");
  const [diet, setDiet] = useState(initialProfile?.diet ?? "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const totalSteps = 3;

  const handleFinish = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_profiles").update({
        goal: goal || null,
        diet: diet || null,
        onboarded_at: new Date().toISOString(),
      }).eq("id", user.id);
      router.replace(`/${locale}/dashboard`);
    } finally {
      setLoading(false);
    }
  };

  const progressPct = (step / totalSteps) * 100;
  const pctToClass = (pct: number) => {
    const v = Math.max(0, Math.min(100, Math.round(pct / 5) * 5));
    return `w-pct-${v}` as const;
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <Card className="rounded-3xl glass-card glass-card-blue glass-frosted-border">
        <CardHeader>
          <CardTitle className="text-2xl">
            {step === 1 && "¿Qué quieres conseguir con Cocorico?"}
            {step === 2 && "¿Cómo te alimentas habitualmente?"}
            {step === 3 && "Así te ayudaremos día a día"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div className={["h-full bg-primary transition-all duration-300", pctToClass(progressPct)].join(" ")} />
          </div>

          {step === 1 && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Elige tu objetivo principal. Esto nos ayuda a ordenar recetas, módulos de Learn y consejos.</p>
              <div className="grid gap-2">
                {[
                  { id: "aprender", label: "Aprender a cocinar mejor" },
                  { id: "ahorrar_tiempo", label: "Cocinar más rápido" },
                  { id: "reducir_desperdicio", label: "Aprovechar mejor la comida" },
                ].map((g) => (
                  <button key={g.id} type="button" onClick={() => setGoal(g.id)} className={`px-4 py-2 rounded-2xl text-left border text-sm ${goal === g.id ? "bg-primary text-white border-primary" : "bg-surface/80"}`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Indica tu estilo de alimentación para filtrar recetas y módulos.</p>
              <div className="grid gap-2">
                {[
                  { id: "omnivoro", label: "Omnívoro" },
                  { id: "vegano", label: "Vegano" },
                  { id: "vegetariano", label: "Vegetariano" },
                  { id: "sin_gluten", label: "Sin gluten" },
                ].map((d) => (
                  <button key={d.id} type="button" onClick={() => setDiet(d.id)} className={`px-4 py-2 rounded-2xl text-left border text-sm ${diet === d.id ? "bg-secondary text-black border-secondary" : "bg-surface/80"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Perfecto. Con esta información ajustaremos tus recetas sugeridas, módulos de Learn recomendados y consejos diarios.</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Verás primero recetas alineadas con tu objetivo.</li>
                <li>Learn te mostrará un camino recomendado.</li>
                <li>Stats y badges reflejarán tu progreso real.</li>
              </ul>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button type="button" className="text-xs text-muted-foreground" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>Atrás</button>
            {step < totalSteps && (
              <RippleButton disabled={step === 1 && !goal} onClick={() => setStep((s) => Math.min(totalSteps, s + 1))} className="h-10 px-5 rounded-2xl">Siguiente</RippleButton>
            )}
            {step === totalSteps && (
              <RippleButton onClick={handleFinish} disabled={loading} className="h-10 px-5 rounded-2xl">Empezar a cocinar ✨</RippleButton>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
