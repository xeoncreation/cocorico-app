import { useState, useEffect } from "react";
import { createClientComponentClient } from "@/lib/supabase/client";

export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkPremiumStatus();

    // Escuchar cambios en tiempo real
    const channel = supabase
      .channel("premium_status_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${supabase.auth.getUser().then((u: any) => u.data.user?.id)}`,
        },
        (payload: any) => {
          const newProfile = payload.new as any;
          setIsPremium(newProfile.is_premium || false);
          setExpiresAt(newProfile.premium_expires_at);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsPremium(false);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_premium, premium_expires_at")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      } else {
        const now = new Date();
        const expires = profile.premium_expires_at
          ? new Date(profile.premium_expires_at)
          : null;

        // Si tiene premium_expires_at, verificar que no haya expirado
        const isActive =
          profile.is_premium &&
          (!expires || expires > now);

        setIsPremium(isActive);
        setExpiresAt(profile.premium_expires_at);
      }
    } catch (err) {
      console.error("Error in checkPremiumStatus:", err);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = () => {
    setLoading(true);
    checkPremiumStatus();
  };

  return { isPremium, loading, expiresAt, refreshStatus };
}
