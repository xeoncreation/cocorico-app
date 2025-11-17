import BadgesClient from "./badges-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logros | Cocorico",
  description: "Desbloquea insignias cocinando, creando y aprendiendo.",
};

export default function BadgesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <BadgesClient />
    </main>
  );
}
