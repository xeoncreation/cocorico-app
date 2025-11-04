import ManageBillingButton from "@/components/billing/ManageBillingButton";
import SubscribeButton from "@/components/billing/SubscribeButton";
import { supabaseServer } from "@/lib/supabase-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { data: { user } } = await supabaseServer!.auth.getUser();
  let isPro = false;
  if (user) {
    const { data } = await supabaseServer!.from('user_subscriptions').select('status').eq('user_id', user.id).maybeSingle();
    isPro = data?.status === 'active';
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Configuración</h1>
      <div className="border rounded p-4 space-y-4">
        <p className="text-sm text-neutral-600">Plan actual: {isPro ? 'Premium' : 'Free'}</p>
        {isPro ? <ManageBillingButton /> : <SubscribeButton />}
      </div>
    </main>
  );
}
