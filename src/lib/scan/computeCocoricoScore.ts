import type { NormalizedProduct } from "./types";

export default function computeCocoricoScore(p: NormalizedProduct): number {
  const nutri = p.nutri_score?.toLowerCase();
  const nutriMap: Record<string, number> = {
    a: 90,
    b: 75,
    c: 60,
    d: 40,
    e: 20,
  };

  let score = nutri ? nutriMap[nutri] ?? 50 : 50;

  if (p.nova_group === 4) score -= 20;
  if (p.nova_group === 3) score -= 10;

  score = Math.max(0, Math.min(score, 100));

  return Math.round(score);
}
