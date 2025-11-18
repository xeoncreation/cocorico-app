import { Metadata } from "next";
import LearnClient from "./learn-client";

export const metadata: Metadata = {
	title: "Centro de Aprendizaje | Cocorico",
	description: "Aprende técnicas, cocina mejor y desbloquea logros.",
};

export default function LearnPage({ params: { locale } }: { params: { locale: string } }) {
	return (
		<main className="max-w-6xl mx-auto px-4 py-10">
			<LearnClient locale={locale} />
		</main>
	);
}
