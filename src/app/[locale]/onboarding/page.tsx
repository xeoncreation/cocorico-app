// src/app/[locale]/onboarding/page.tsx
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import OnboardingClient from './onboarding-client';
import { AppBackground } from '@/components/layout/AppBackground';

export default async function OnboardingPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("goal, diet, onboarded_at")
    .eq("id", user.id)
    .single();
  if (profile?.onboarded_at) {
    redirect(`/${locale}/dashboard`);
  }
  return (
    <AppBackground variantOverride="onboarding">
      <OnboardingClient locale={locale} initialProfile={profile ?? undefined} />
    </AppBackground>
  );
}
