'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

export function UmamiAnalytics() {
  useEffect(() => {
    // Umami se cargará desde el script en layout.tsx
    // Este componente solo expone helpers para tracking
  }, []);

  return null;
}

// Helper functions para trackear eventos comunes
export const trackEvent = {
  // Recetas
  recipeCreated: (recipeId: string) => {
    window.umami?.track('recipe_created', { recipe_id: recipeId });
  },
  recipeViewed: (recipeId: string) => {
    window.umami?.track('recipe_viewed', { recipe_id: recipeId });
  },
  recipeFavorited: (recipeId: string) => {
    window.umami?.track('recipe_favorited', { recipe_id: recipeId });
  },
  recipeShared: (recipeId: string, platform: string) => {
    window.umami?.track('recipe_shared', { recipe_id: recipeId, platform });
  },

  // Chat IA
  aiChatStarted: () => {
    window.umami?.track('ai_chat_started');
  },
  aiMessageSent: (messageLength: number) => {
    window.umami?.track('ai_message_sent', { message_length: messageLength });
  },
  aiVisionUsed: (source: 'local' | 'cloud') => {
    window.umami?.track('ai_vision_used', { source });
  },

  // Gamificación
  challengeCompleted: (challengeId: string) => {
    window.umami?.track('challenge_completed', { challenge_id: challengeId });
  },
  badgeEarned: (badgeId: string) => {
    window.umami?.track('badge_earned', { badge_id: badgeId });
  },
  levelUp: (newLevel: number) => {
    window.umami?.track('level_up', { level: newLevel });
  },

  // Comunidad
  postCreated: (postId: string) => {
    window.umami?.track('post_created', { post_id: postId });
  },
  postLiked: (postId: string) => {
    window.umami?.track('post_liked', { post_id: postId });
  },
  userFollowed: (targetUserId: string) => {
    window.umami?.track('user_followed', { target_user_id: targetUserId });
  },

  // Suscripciones
  subscriptionStarted: (plan: string) => {
    window.umami?.track('subscription_started', { plan });
  },
  subscriptionCancelled: (plan: string) => {
    window.umami?.track('subscription_cancelled', { plan });
  },

  // Onboarding
  onboardingStarted: () => {
    window.umami?.track('onboarding_started');
  },
  onboardingCompleted: () => {
    window.umami?.track('onboarding_completed');
  },
  onboardingStepCompleted: (step: number) => {
    window.umami?.track('onboarding_step_completed', { step });
  },

  // PWA
  pwaInstalled: () => {
    window.umami?.track('pwa_installed');
  },
  pwaLaunched: () => {
    window.umami?.track('pwa_launched');
  },

  // Errores
  errorEncountered: (errorType: string, errorMessage: string) => {
    window.umami?.track('error_encountered', { type: errorType, message: errorMessage });
  },
};
