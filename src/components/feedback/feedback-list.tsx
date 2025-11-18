"use client";

import useSWR from "swr";
import { motion } from "framer-motion";

export function FeedbackList() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/feedback/list", fetcher, { refreshInterval: 4000 });

  if (!data) return <div>Cargando…</div>;

  return (
    <div className="space-y-4">
      {data.data.map((item: any) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card glass-card-purple glass-frosted-border p-4"
        >
          <div className="flex justify-between items-center">
            <div className="font-semibold">{item.title}</div>
            <div className="text-sm opacity-60">{item.status}</div>
          </div>

          <p className="text-sm mt-2">{item.message}</p>

          {item.image_url && (
            <img src={item.image_url} alt="Captura de feedback" className="rounded-lg mt-3 max-h-40" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
