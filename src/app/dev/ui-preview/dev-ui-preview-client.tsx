"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RippleButton } from "@/components/ui/ripple-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Moon, ChefHat, Flame, Award, Star, Info, Shield, LayoutDashboard } from "lucide-react";
export default function DevUiPreviewClient() {
  const [theme, setTheme] = useState<"free" | "premium">("free");
  useEffect(() => { setTheme(document.documentElement.dataset.theme === "premium" ? "premium" : "free"); }, []);
  const applyTheme = (t: "free" | "premium") => { document.documentElement.dataset.theme = t; setTheme(t); };
  return (
    <section className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><LayoutDashboard className="w-7 h-7 text-primary"/> Cocorico UI Preview</h1>
          <p className="text-sm text-muted-foreground">Vista interna para revisar el sistema visual, temas, glass y microinteracciones.</p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant={theme === "free" ? "default" : "outline"} className="rounded-xl flex items-center gap-2" onClick={()=>applyTheme("free")}> <Sun className="w-4 h-4"/> Free </Button>
          <Button type="button" variant={theme === "premium" ? "default" : "outline"} className="rounded-xl flex items-center gap-2" onClick={()=>applyTheme("premium")}> <Moon className="w-4 h-4"/> Premium </Button>
        </div>
      </header>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Glass Cards – Paleta</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { cls: "orange", Icon: ChefHat, title: "Orange", desc: "CTA principal" },
            { cls: "green", Icon: Shield, title: "Green", desc: "Éxito" },
            { cls: "red", Icon: Flame, title: "Red", desc: "Error" },
            { cls: "blue", Icon: Info, title: "Blue", desc: "Info" },
            { cls: "purple", Icon: Star, title: "Purple", desc: "Premium" },
          ].map(c => (
            <Card key={c.cls} className={cn("glass-card glass-card-"+c.cls+" glass-frosted-border p-4")}> 
              <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><c.Icon className="w-4 h-4"/> {c.title}</CardTitle></CardHeader>
              <CardContent className="text-xs opacity-80">{c.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Botones & Ripple</h2>
        <div className="flex flex-wrap gap-4">
          <RippleButton className="rounded-2xl h-11 px-6 bg-primary text-white">Cocinar ahora 🍳</RippleButton>
          <RippleButton className="rounded-2xl h-11 px-6 glass-card glass-card-purple">Premium ✨</RippleButton>
          <RippleButton className="rounded-2xl h-11 px-6 glass-card glass-card-green">Guardar ✅</RippleButton>
          <RippleButton className="rounded-2xl h-11 px-6 glass-card glass-card-red">Eliminar 🗑️</RippleButton>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Preview secciones</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="glass-card glass-card-blue glass-frosted-border p-4 rounded-2xl"><CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><Flame className="w-4 h-4"/> Stats</CardTitle></CardHeader><CardContent className="text-xs space-y-1"><p>Recetas mes: <b>12</b></p><p>Horas: <b>8h</b></p></CardContent></Card>
          <Card className="glass-card glass-card-orange glass-frosted-border p-4 rounded-2xl"><CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><Award className="w-4 h-4"/> Badges</CardTitle></CardHeader><CardContent className="text-xs space-y-1"><p>Desbloqueados: <b>5</b></p><p>En progreso: <b>3</b></p></CardContent></Card>
          <Card className="glass-card glass-card-purple glass-frosted-border p-4 rounded-2xl"><CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2"><Star className="w-4 h-4"/> Planes</CardTitle></CardHeader><CardContent className="text-xs space-y-2"><p>Free: base</p><p>Premium: IA + stats</p><RippleButton className="w-full rounded-xl text-xs h-8 mt-2">Comparar</RippleButton></CardContent></Card>
        </div>
      </section>
    </section>
  );
}
