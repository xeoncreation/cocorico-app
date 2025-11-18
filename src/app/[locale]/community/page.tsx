import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CommunityClient from "./community-client";

export default async function CommunityPage({ params }: { params: { locale: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${params.locale}/auth/login`);

  return <CommunityClient locale={params.locale} />;
}
