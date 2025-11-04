"use client";

import Image from "next/image";

interface CocoricoTipProps {
  title: string;
  text: string;
  image: string;
}

export default function CocoricoTip({ title, text, image }: CocoricoTipProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg shadow-sm bg-white/60 backdrop-blur-md">
      <Image
        src={image}
        alt="Cocorico"
        width={160}
        height={160}
        className="rounded-xl object-contain bg-white"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-amber-700">{title}</h3>
        <p className="text-neutral-700 text-sm">{text}</p>
      </div>
    </div>
  );
}
