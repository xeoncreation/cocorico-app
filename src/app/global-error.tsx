"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white">
          <h2 className="mb-4 text-2xl font-bold">Algo salió mal</h2>
          <button
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            onClick={() => reset()}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
