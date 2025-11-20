import FeedbackClient from "./feedback-client";
import { Metadata } from "next";
import { createServerComponentClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";
import { AppBackground } from "@/components/layout/AppBackground";

export const metadata: Metadata = {
  title: "Feedback | Cocorico",
  description: "Envía sugerencias, reporta errores y revisa el estado de tus tickets.",
};

export default async function FeedbackPage() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-6 text-red-500">Debes iniciar sesión.</div>;

  return (
    <AppBackground variantOverride="feedback">
      <main className="max-w-5xl mx-auto px-4 py-10">
        <FeedbackClient />
      </main>
    </AppBackground>
  );
}