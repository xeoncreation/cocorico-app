import { redirect } from "next/navigation";
import { supabaseServer } from "@/app/lib/supabase-server";
import LabClient from "./lab-client";

export const dynamic = "force-dynamic";

export default async function LabPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Comprobar si es dev/admin
  const isDev = process.env.NODE_ENV === "development";
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  if (!isDev && !isAdmin) {
    redirect("/scanner");
  }

  return <LabClient />;
}
