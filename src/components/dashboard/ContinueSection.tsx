"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import { Clock, ChefHat, MessageSquare } from "lucide-react";
import { RippleButton } from "@/components/ui/ripple-button";

interface LastActivity {
  type: "recipe" | "challenge" | "chat";
  title: string;
  href: string;
  time: string;
}

export default function ContinueSection({ locale }: { locale: string }) {
  const [activity, setActivity] = useState<LastActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadLastActivity() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: interactions } = await supabase
          .from("user_interactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (interactions) {
          setActivity({
            type: interactions.interaction_type || "chat",
            title: interactions.metadata?.title || "Última actividad",
            href: `/${locale}/dashboard`,
            time: new Date(interactions.created_at).toLocaleDateString(),
          });
        }
      } catch (error) {
        console.error("Error loading activity:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLastActivity();
  }, [supabase, locale]);

  if (loading || !activity) return null;

  const icons = {
    recipe: <ChefHat className="w-5 h-5" />,
    challenge: <Clock className="w-5 h-5" />,
    chat: <MessageSquare className="w-5 h-5" />,
  };

  return (
    <GlassCard className="p-6 mb-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cocorico-mango/20 flex items-center justify-center">
            {icons[activity.type]}
          </div>
          <div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Continuar</p>
            <h3 className="font-semibold text-neutral-900 dark:text-white">{activity.title}</h3>
          </div>
        </div>
        <RippleButton asChild size="sm" className="coco-btn-primary">
          <Link href={activity.href}>Continuar</Link>
        </RippleButton>
      </div>
    </GlassCard>
  );
}
