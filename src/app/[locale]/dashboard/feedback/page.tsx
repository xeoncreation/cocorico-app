import FeedbackClient from "./feedback-client";
import { Metadata } from "next";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Feedback | Cocorico",
  description: "Envía sugerencias, reporta errores y revisa el estado de tus tickets.",
};

export default async function FeedbackPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-6 text-red-500">Debes iniciar sesión.</div>;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <FeedbackClient />
    </main>
  );
}