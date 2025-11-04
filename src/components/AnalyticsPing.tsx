"use client";

import { useEffect } from "react";

export default function AnalyticsPing({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "view_recipe", recipe_slug: slug }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }, [slug]);
  return null;
}
