import React from 'react';

export type AppBackgroundVariant = 'home' | 'learn' | 'stats' | 'community';

const backgroundMap: Record<AppBackgroundVariant, string | null> = {
  home: '/wallpapers/home-blur.webp',
  learn: '/wallpapers/learn-blur.webp',
  stats: '/wallpapers/stats-blur.webp',
  community: '/wallpapers/community-blur.webp',
};

interface Props {
  variant?: AppBackgroundVariant;
  children: React.ReactNode;
  className?: string;
}

export function AppBackground({ variant = 'home', children, className }: Props) {
  const url = backgroundMap[variant];
  return (
    <div className={['relative min-h-screen app-root-bg-inner', className].filter(Boolean).join(' ')}>
      {url && (
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="w-full h-full opacity-70">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover blur-3xl scale-105"
              loading="lazy"
              aria-hidden="true"
            />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export default AppBackground;
