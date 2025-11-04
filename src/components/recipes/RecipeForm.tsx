"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecipeInput, recipeSchema } from "@/schemas/recipe";
import type { FieldError } from "react-hook-form";

export default function RecipeForm({
  defaultValues,
  onSubmit,
  submitting = false,
}: {
  defaultValues?: Partial<RecipeInput>;
  onSubmit: (data: RecipeInput) => void | Promise<void>;
  submitting?: boolean;
}) {
  const form = useForm<RecipeInput>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      ingredients: [""],
      steps: [""],
      time_minutes: 20,
      difficulty: "fácil",
      visibility: "private",
      ...defaultValues,
    },
  });

  const { register, handleSubmit, control, formState: { errors } } = form;
  // @ts-ignore - TypeScript inference issue with nested arrays
  const ing = useFieldArray({ control, name: "ingredients" });
  // @ts-ignore - TypeScript inference issue with nested arrays
  const steps = useFieldArray({ control, name: "steps" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="font-semibold">Título</label>
        <input className="w-full mt-1 rounded border px-3 py-2" {...register("title")} />
        {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="font-semibold">Descripción</label>
        <textarea className="w-full mt-1 rounded border px-3 py-2" rows={3} {...register("description")} />
      </div>

      <div>
        <label className="font-semibold">Ingredientes</label>
        {ing.fields.map((f: any, idx: number) => (
          <div key={f.id} className="flex gap-2 mt-2">
            <input className="flex-1 rounded border px-3 py-2" {...register(`ingredients.${idx}` as const)} />
            <button type="button" className="px-2 border rounded" onClick={() => ing.remove(idx)}>–</button>
          </div>
        ))}
        <button type="button" className="mt-2 px-3 py-1 rounded border" onClick={() => ing.append("")}>+ Añadir</button>
        {errors.ingredients && <p className="text-red-600 text-sm">{errors.ingredients.message as string}</p>}
      </div>

      <div>
        <label className="font-semibold">Pasos</label>
        {steps.fields.map((f: any, idx: number) => (
          <div key={f.id} className="flex gap-2 mt-2">
            <textarea className="flex-1 rounded border px-3 py-2" rows={2} {...register(`steps.${idx}` as const)} />
            <button type="button" className="px-2 border rounded" onClick={() => steps.remove(idx)}>–</button>
          </div>
        ))}
        <button type="button" className="mt-2 px-3 py-1 rounded border" onClick={() => steps.append("")}>+ Añadir</button>
        {errors.steps && <p className="text-red-600 text-sm">{errors.steps.message as string}</p>}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="font-semibold">Tiempo (min)</label>
          <input type="number" className="w-full mt-1 rounded border px-3 py-2" {...register("time_minutes", { valueAsNumber: true })} />
        </div>
        <div>
          <label className="font-semibold">Dificultad</label>
          <select className="w-full mt-1 rounded border px-3 py-2" {...register("difficulty")}>
            <option value="fácil">Fácil</option>
            <option value="media">Media</option>
            <option value="difícil">Difícil</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Visibilidad</label>
          <select className="w-full mt-1 rounded border px-3 py-2" {...register("visibility")}>
            <option value="private">Privada</option>
            <option value="public">Pública</option>
          </select>
        </div>
      </div>

      <div>
        <label className="font-semibold">Imagen (URL)</label>
        <input className="w-full mt-1 rounded border px-3 py-2" placeholder="https://…" {...register("image_url")} />
      </div>

      <button disabled={submitting} className="px-4 py-2 rounded bg-cocorico-red text-white font-semibold">
        {submitting ? "Guardando…" : "Guardar receta"}
      </button>
    </form>
  );
}
