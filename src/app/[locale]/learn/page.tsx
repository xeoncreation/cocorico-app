import { Metadata } from "next";
import LearnClient from "./learn-client";
import { AppBackground } from "@/components/layout/AppBackground";
import Wallpaper from "@/components/layout/Wallpaper";

export const metadata: Metadata = {
	title: "Centro de Aprendizaje | Cocorico",
	description: "Aprende técnicas, cocina mejor y desbloquea logros.",
};

export default function LearnPage({ params: { locale } }: { params: { locale: string } }) {
	return (
		<>
			<Wallpaper
				imageLight="/branding/LEARN_MODO_CLARO.jpg"
				imageDark="/branding/LEARN_MODO_OSCURO.jpg"
			/>
			<AppBackground variantOverride="learn">
				<main className="max-w-6xl mx-auto px-4 py-10">
					<LearnClient locale={locale} />
				</main>
			</AppBackground>
		</>
	);
}
