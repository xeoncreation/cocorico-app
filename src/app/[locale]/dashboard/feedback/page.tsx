import FeedbackClient from "./feedback-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback | Cocorico",
  description: "Envía sugerencias, reporta errores y revisa el estado de tus tickets.",
};

export default function FeedbackPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <FeedbackClient />
    </main>
  );
}