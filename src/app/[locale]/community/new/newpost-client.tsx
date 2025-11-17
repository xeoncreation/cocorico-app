"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function NewPostClient() {
  const [content, setContent] = useState("");

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Crear nueva publicación</h1>

      <Textarea
        placeholder="Comparte algo con la comunidad..."
        rows={4}
        className="rounded-xl"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button disabled={!content.trim().length} className="rounded-xl h-12">
        Publicar
      </Button>
    </section>
  );
}
