"use client";
import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";
import { useEffect, useState } from "react";
const fetcher = (url: string) => fetch(url).then(r => r.json());
export default function BadgesClient() {
  const { data } = useSWR("/api/dashboard/badges", fetcher);
  const [plan, setPlan] = useState<"free"|"premium">("free");
  useEffect(()=>{ setPlan(document.documentElement.dataset.theme === "premium"?"premium":"free");},[]);
  return (
    <section className="space-y-6">
      <header className="flex items-center gap-2">
        <Award className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Logros y Badges</h1>
          <p className="text-sm text-muted-foreground">Recompensas por tu actividad en Cocorico.</p>
        </div>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        {data?.badges?.length ? data.badges.map((b:any)=>(
          <Card key={b.badges.code} className={cn("border rounded-2xl p-4 bg-surface/80", plan==="premium" && "glass-card glass-card-orange glass-frosted-border")}> 
            <CardHeader className="pb-1">
              <CardTitle className="text-base flex items-center gap-2">
                <span>{b.badges.icon||"🏅"}</span>{b.badges.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>{b.badges.description}</p>
              <p className="text-xs opacity-70">Obtenido: {new Date(b.earned_at).toLocaleDateString("es-ES")}</p>
            </CardContent>
          </Card>
        )) : <p className="text-sm text-muted-foreground">Aún no tienes badges. Empieza creando tus primeras recetas o usando Learn.</p>}
      </div>
    </section>
  );
}
