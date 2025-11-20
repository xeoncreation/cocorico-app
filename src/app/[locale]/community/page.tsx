import { createServerComponentClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CommunityClient from "./community-client";
import { AppBackground } from "@/components/layout/AppBackground";

export default async function CommunityPage({ params }: { params: { locale: string } }) {
  const supabase = createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${params.locale}/auth/login`);

  return (
    <AppBackground variantOverride="community">
      <CommunityClient locale={params.locale} />
    </AppBackground>
  );
}
