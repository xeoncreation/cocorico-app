"use client";

import ChatBox from "@/components/ChatBox";
import VoiceChat from "@/components/VoiceChat";
import Image from "next/image";
import { useState } from "react";

import { AppBackground } from "@/components/layout/AppBackground";
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState<"texto" | "voz">("texto");

  return (
    <LegacyPageWrapper>
      <AppBackground variantOverride="community">
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
        
        {/* Pestañas */}
        <div className="flex gap-2 mb-4 border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab("texto")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "texto"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            💬 Texto
          </button>
          <button
            onClick={() => setActiveTab("voz")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "voz"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            🎙️ Voz
          </button>
        </div>

        {/* Contenido según pestaña activa */}
        {activeTab === "texto" ? <ChatBox /> : <VoiceChat />}
        
        </section>
      </AppBackground>
    </LegacyPageWrapper>
  );
}
