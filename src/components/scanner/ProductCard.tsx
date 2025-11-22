import type { NormalizedProduct } from "@/lib/scan/types";

type Props = {
  product: NormalizedProduct & {
    cocorico_score: number;
  };
};

export default function ProductCard({ product }: Props) {
  const score = product.cocorico_score ?? 0;

  const bgColor =
    score >= 80
      ? "bg-green-500/30"
      : score >= 65
      ? "bg-yellow-500/30"
      : score >= 45
      ? "bg-orange-500/30"
      : "bg-red-500/30";

  const label =
    score >= 80
      ? "Excelente elección"
      : score >= 65
      ? "Aceptable"
      : score >= 45
      ? "Consumo moderado"
      : "Mejor evitarlo";

  return (
    <div
      className={`p-6 mt-4 rounded-3xl backdrop-blur-2xl border border-white/20 ${bgColor}`}
    >
      <div className="flex gap-4">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 rounded-xl object-cover shadow-md"
          />
        )}
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold text-white drop-shadow">
            {product.name}
          </h2>
          {product.brand && (
            <p className="text-sm text-white/80">
              {product.brand}
            </p>
          )}
          <p className="text-xs text-white/60 mt-1">
            Código de barras: {product.barcode}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-lg font-semibold text-white">
          Puntuación Cocorico: {score}/100
        </div>
        <div className="text-sm text-white/80">
          {label}
        </div>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-white/80">
        {product.nutri_score && (
          <span className="px-2 py-1 rounded-full bg-black/30 border border-white/20">
            Nutri-Score: {product.nutri_score.toUpperCase()}
          </span>
        )}
        {product.nova_group != null && (
          <span className="px-2 py-1 rounded-full bg-black/30 border border-white/20">
            NOVA: {product.nova_group}
          </span>
        )}
      </div>
    </div>
  );
}
