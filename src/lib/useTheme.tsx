import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Create a tolerant Supabase-like client so the app doesn't crash if public keys are missing
// (tests and local dev may run without real secrets).
let supabase: any;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
} else {
  // Minimal no-op client that mirrors the subset of methods used by useTheme
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          // maybeSingle should return a promise resolving to a safe shape
          maybeSingle: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  };
}

/**
 * useTheme
 * Reads the current user's plan from user_profiles and sets data-theme accordingly.
 * Falls back to 'free'. Exposes a light re-fetch mechanism via window event for admin toggles.
 */
export const useTheme = (userId?: string) => {
  useEffect(() => {
    const apply = (plan: 'free' | 'premium' = 'free') => {
      const root = document.documentElement;
      root.dataset.theme = plan;
      
      // Add/remove coco-premium class for premium-specific effects
      if (plan === 'premium') {
        root.classList.add('coco-premium');
      } else {
        root.classList.remove('coco-premium');
      }
    };

    // Always set an initial theme quickly to avoid FOUC.
    apply('free');

    if (!userId) return; // Without user we keep 'free'.

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('plan')
          .eq('user_id', userId)
          .maybeSingle();
        if (error) throw error;
        apply((data?.plan as 'free' | 'premium') || 'free');
      } catch (err) {
        console.warn('useTheme load error:', err);
        apply('free');
      }
    };

    load();

    // Listen for a custom event to re-load after admin plan changes.
    const handler = () => load();
    window.addEventListener('cocorico:theme-refresh', handler);
    return () => window.removeEventListener('cocorico:theme-refresh', handler);
  }, [userId]);
};

/**
 * Manually trigger a theme refresh elsewhere (e.g. after plan toggle in admin UI)
 */
export const triggerThemeRefresh = () => {
  window.dispatchEvent(new Event('cocorico:theme-refresh'));
};
