import { Metadata } from "next";
import DevUiPreviewClient from "./dev-ui-preview-client";

export const metadata: Metadata = {
  title: "Cocorico UI Preview",
  description: "Vista interna para revisar el sistema visual Free / Premium.",
};

export default function DevUiPreviewPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <DevUiPreviewClient />
    </main>
  );
}
