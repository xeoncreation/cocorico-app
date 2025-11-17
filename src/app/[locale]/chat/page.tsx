"use client";

import { useTranslations } from "next-intl";
import ChatBox from "@/components/ChatBox";

export default function ChatPage() {
  const t = useTranslations();

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50/80 via-white to-rose-50/60 dark:from-pink-950/20 dark:via-neutral-900 dark:to-rose-950/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-display text-pink-900 dark:text-pink-300">
            {t("chat.title")} 🐓
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("chat.subtitle")}
          </p>
        </div>
        <ChatBox />
      </div>
    </section>
  );
}
