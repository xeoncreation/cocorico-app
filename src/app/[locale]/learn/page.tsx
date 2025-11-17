import { Metadata } from "next";
import LearnClient from "./learn-client";

export const metadata: Metadata = {
	title: "Centro de Aprendizaje | Cocorico",
	description: "Aprende técnicas, cocina mejor y desbloquea logros.",
};

export default function LearnPage() {
	return (
		<main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
			<header className="space-y-1">
				<h1 className="text-3xl font-bold">Centro de aprendizaje</h1>
				<p className="text-sm text-muted-foreground">
					Cursos, técnicas, glosario y recursos descargables.
				</p>
			</header>

			<LearnClient />
		</main>
	);
}
