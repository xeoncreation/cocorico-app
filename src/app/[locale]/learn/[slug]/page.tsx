import { cookies } from "next/headers";
import { createServerComponentClient } from "@/lib/supabase/server";
import ModuleClient from "./module-client";
import { notFound } from "next/navigation";

export default async function LearnModulePage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: module, error: e1 } = await supabase
    .from("learn_modules")
    .select("*")
    .eq("slug", slug)
    .single();

  if (e1 || !module) notFound();

  const { data: progress } = await supabase
    .from("module_progress")
    .select("status, completed_at")
    .eq("user_id", user.id)
    .eq("module_id", module.id)
    .maybeSingle();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <ModuleClient
        locale={locale}
        module={module}
        initialProgress={progress ?? null}
      />
    </main>
  );
}
