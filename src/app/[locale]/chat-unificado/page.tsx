"use client";

import ModernUnifiedChat from "@/components/chat/ModernUnifiedChat";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';

  return (
    <div className="w-full h-screen">
      <ModernUnifiedChat 
        locale={locale} 
        apiEndpoint="/api/chat-unified"
      />
    </div>
  );
}
