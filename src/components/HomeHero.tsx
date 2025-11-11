import React, { useEffect, useState } from 'react';
import { getThemeAsset } from '@/lib/themeClient';

export default function HomeHero() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const asset = await getThemeAsset('home');
        setUrl(asset);
      } catch (err) {
        console.warn('HomeHero assets error:', err);
      }
    })();
  }, []);

  if (!url) return null;
  const isVideo = url.endsWith('.mp4') || url.includes('.mp4?');

  return (
    <div className="relative w-full h-[40vh] md:h-[56vh] overflow-hidden rounded-2xl">
      {isVideo ? (
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src={url} type="video/mp4" />
        </video>
      ) : (
        <img src={url} alt="home visual" className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
}
