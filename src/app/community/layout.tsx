"use client";
import Navbar from "@/components/Navbar";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-orange-50/30 dark:from-neutral-900 dark:to-neutral-900">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
