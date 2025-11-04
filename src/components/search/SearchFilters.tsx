"use client";
import { useState } from "react";

export default function SearchFilters(props: {
  q: string; setQ: (v: string) => void;
  ingredients: string[]; setIngredients: (v: string[]) => void;
  difficulty: string | null; setDifficulty: (v: string | null) => void;
  maxTime: number | null; setMaxTime: (v: number | null) => void;
  onSubmit: () => void;
}) {
  const [ingInput, setIngInput] = useState("");

  function addIng() {
    const v = ingInput.trim().toLowerCase();
    if (!v) return;
    if (!props.ingredients.includes(v)) {
      props.setIngredients([...props.ingredients, v]);
    }
    setIngInput("");
  }

  return (
    <form
      className="rounded-xl bg-white dark:bg-neutral-900 border p-4 grid md:grid-cols-4 gap-4"
      onSubmit={(e) => { e.preventDefault(); props.onSubmit(); }}
    >
      <div className="md:col-span-2">
        <label className="text-sm font-semibold">Buscar</label>
        <input
          value={props.q}
          onChange={(e) => props.setQ(e.target.value)}
          placeholder="pasta, ensalada, curry…"
          className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-neutral-800"
        />
      </div>

      <div>
        <label htmlFor="difficulty-select" className="text-sm font-semibold">Dificultad</label>
        <select
          id="difficulty-select"
          value={props.difficulty ?? ""}
          onChange={(e) => props.setDifficulty(e.target.value || null)}
          className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-neutral-800"
        >
          <option value="">Todas</option>
          <option value="fácil">Fácil</option>
          <option value="media">Media</option>
          <option value="difícil">Difícil</option>
        </select>
      </div>

      <div>
        <label htmlFor="maxTime-input" className="text-sm font-semibold">Tiempo máx. (min)</label>
        <input
          id="maxTime-input"
          type="number" min={1}
          value={props.maxTime ?? ""}
          onChange={(e) => props.setMaxTime(e.target.value ? Number(e.target.value) : null)}
          className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-neutral-800"
        />
      </div>

      <div className="md:col-span-4">
        <label className="text-sm font-semibold">Ingredientes (pulsa "+")</label>
        <div className="flex gap-2 mt-1">
          <input
            value={ingInput}
            onChange={(e) => setIngInput(e.target.value)}
            placeholder="tomate, arroz…"
            className="flex-1 rounded border px-3 py-2 bg-white dark:bg-neutral-800"
          />
          <button type="button" onClick={addIng} className="px-3 py-2 rounded bg-cocorico-yellow text-cocorico-red font-semibold">
            +
          </button>
        </div>
        {!!props.ingredients.length && (
          <div className="flex flex-wrap gap-2 mt-2">
            {props.ingredients.map(i => (
              <span key={i} className="px-2 py-1 text-sm rounded-full border">
                {i}
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => props.setIngredients(props.ingredients.filter(x => x !== i))}
                >×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="md:col-span-4">
        <button className="px-4 py-2 rounded bg-cocorico-red text-white font-semibold">
          Buscar
        </button>
      </div>
    </form>
  );
}
