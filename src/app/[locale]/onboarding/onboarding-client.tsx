"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RippleButton } from "@/components/ui/ripple-button";
export default function OnboardingClient(){
  const [step,setStep]=useState(1);
  const [goal,setGoal]=useState<string>("");
  const [diet,setDiet]=useState<string>("");
  const next=()=>setStep(s=>Math.min(3,s+1));
  const prev=()=>setStep(s=>Math.max(1,s-1));
  const complete=async()=>{
    await fetch("/api/me/profile",{method:"POST",body:JSON.stringify({goal,diet})});
    window.location.href="/dashboard";
  };
  useEffect(()=>{},[]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Onboarding</h1>
      {step===1 && <Card className="glass-card glass-card-blue glass-frosted-border"><CardHeader><CardTitle>Tu objetivo principal</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">¿Qué buscas?</p><div className="grid gap-2 md:grid-cols-3"><button onClick={()=>{setGoal("aprender");next();}} className="rounded-xl border px-4 py-3 hover:bg-blue-500/10">Aprender</button><button onClick={()=>{setGoal("ahorrar_tiempo");next();}} className="rounded-xl border px-4 py-3 hover:bg-blue-500/10">Ahorrar tiempo</button><button onClick={()=>{setGoal("reducir_desperdicio");next();}} className="rounded-xl border px-4 py-3 hover:bg-blue-500/10">Reducir desperdicio</button></div></CardContent></Card>}
      {step===2 && <Card className="glass-card glass-card-green glass-frosted-border"><CardHeader><CardTitle>Preferencias de alimentación</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Selecciona una opción:</p><div className="grid gap-2 md:grid-cols-3"><button onClick={()=>setDiet("omnivoro")} className={`rounded-xl border px-4 py-3 ${diet==="omnivoro"&&"bg-green-500/20"}`}>Omnívoro</button><button onClick={()=>setDiet("vegetariano")} className={`rounded-xl border px-4 py-3 ${diet==="vegetariano"&&"bg-green-500/20"}`}>Vegetariano</button><button onClick={()=>setDiet("vegano")} className={`rounded-xl border px-4 py-3 ${diet==="vegano"&&"bg-green-500/20"}`}>Vegano</button></div><div className="flex justify-between"><RippleButton onClick={prev} className="rounded-xl px-4 py-2">Atrás</RippleButton><RippleButton disabled={!diet} onClick={next} className="rounded-xl px-4 py-2">Siguiente</RippleButton></div></CardContent></Card>}
      {step===3 && <Card className="glass-card glass-card-purple glass-frosted-border"><CardHeader><CardTitle>Resumen</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm">Objetivo: <strong>{goal||"-"}</strong></p><p className="text-sm">Dieta: <strong>{diet||"-"}</strong></p><RippleButton disabled={!goal||!diet} onClick={complete} className="rounded-xl px-5 py-3">Finalizar</RippleButton></CardContent></Card>}
    </div>
  );
}
