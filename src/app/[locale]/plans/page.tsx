import PlansClient from "./plans-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planes | Cocorico",
  description: "Comparativa entre Free y Premium. Actualiza para desbloquear todo el potencial.",
};

export default function PlansPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <PlansClient />
    </main>
  );
}

