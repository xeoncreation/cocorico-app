"use client";

import ChatBox from "@/components/ChatBox";
import Image from "next/image";

export default function ChatPage() {
  return (
    <section className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src="/branding/cocorico-mascot-anim-optimized.gif"
          alt="Cocorico animado"
          width={56}
          height={83}
          className="drop-shadow-sm fade-edge-sm"
          unoptimized
        />
        <h1 className="text-2xl font-semibold">Chat con Cocorico 🐓</h1>
      </div>
      <div className="h-3" />
      <ChatBox />
    </section>
  );
}
