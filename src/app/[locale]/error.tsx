"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
        ¡Vaya! Algo no ha funcionado
      </h2>
      <p className="mb-6 text-neutral-600 dark:text-neutral-400">
        Ha ocurrido un error inesperado.
      </p>
      <Button
        onClick={() => reset()}
        className="bg-cocorico-red hover:bg-red-700 text-white"
      >
        Intentar de nuevo
      </Button>
    </div>
  );
}
