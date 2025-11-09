"use client";

import AuthButton from "@/components/AuthButton";
import TestMessages from "@/components/TestMessages";

// Force dynamic rendering (uses Supabase client)
export const dynamic = "force-dynamic";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-8 px-4">
          <AuthButton />
        </div>
        <TestMessages />
      </div>
    </div>
  );
}