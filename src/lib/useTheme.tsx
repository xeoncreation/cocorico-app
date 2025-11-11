import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Single browser Supabase client (anon key only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * useTheme
 * Reads the current user's plan from user_profiles and sets data-theme accordingly.
 * Falls back to 'free'. Exposes a light re-fetch mechanism via window event for admin toggles.
 */
export const useTheme = (userId?: string) => {
  useEffect(() => {
    const apply = (plan: 'free' | 'premium' = 'free') => {
      document.documentElement.dataset.theme = plan;
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
