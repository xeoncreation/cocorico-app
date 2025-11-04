"use client";

import { useTranslations } from "next-intl";
import ChatBox from "@/components/ChatBox";
import Image from "next/image";

export default function ChatPage() {
  const t = useTranslations();

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src="/branding/cocorico-mascot-anim-optimized.gif"
          alt="Cocorico animado"
          width={56}
          height={83}
          className="drop-shadow-sm fade-edge-sm"
          unoptimized
        />
        <h1 className="text-3xl font-display text-cocorico-red">
          {t("chat.title")} 🐓
        </h1>
      </div>
      <p className="text-cocorico-brown mb-6">
        {t("chat.subtitle")}
      </p>
      <ChatBox />
    </section>
  );
}
