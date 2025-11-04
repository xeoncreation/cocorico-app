"use client";
export default function RecipesError({ error }: { error: Error }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-red-700 font-semibold">Ups, algo falló</h2>
      <p className="text-sm text-neutral-600">{error.message}</p>
    </div>
  );
}
