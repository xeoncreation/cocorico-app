"use client";
export default function DashboardError({ error }: { error: Error }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-red-700 font-semibold">Error en el dashboard</h2>
      <p className="text-sm text-neutral-600">{error.message}</p>
    </div>
  );
}
