"use client";

import { useState } from "react";
import { RippleButton } from "@/components/ui/ripple-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
  locale: string;
  module: any;
  initialProgress: { status: string; completed_at: string | null } | null;
};

export default function ModuleClient({ module, initialProgress }: Props) {
  const [completed, setCompleted] = useState(
    initialProgress?.status === "completed"
  );
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/learn/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_id: module.id }),
      });
      if (res.ok) {
        setCompleted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl glass-card glass-card-blue glass-frosted-border">
      <CardHeader>
        <CardTitle className="text-2xl">{module.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm text-muted-foreground">
        {module.video_url && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-black/40">
            <video
              src={module.video_url}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <p>{module.description}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Duración estimada: {module.duration_minutes ?? 10} min</li>
          <li>Nivel: {module.level ?? "básico"}</li>
        </ul>

        <div className="flex justify-end">
          <RippleButton
            disabled={completed || loading}
            onClick={handleComplete}
            className="h-10 px-5 rounded-2xl"
          >
            {completed ? "Completado ✔" : "Marcar como completado"}
          </RippleButton>
        </div>
      </CardContent>
    </Card>
  );
}
