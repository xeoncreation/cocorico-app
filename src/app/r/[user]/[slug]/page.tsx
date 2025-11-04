
import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Reveal from "@/components/ui/Reveal";
import { motion } from "framer-motion";

export async function generateMetadata({ params }: { params: { user: string; slug: string } }) {
  return {
    title: `Receta de ${params.user} — ${params.slug} | Cocorico`,
    description: "Explora recetas públicas en Cocorico",
    openGraph: {
      title: `Receta de ${params.user}`,
      images: ["/branding/banner-home.png"],
    },
  };
}

export default async function RecipePublicPage({ params }: { params: { user: string; slug: string } }) {
  // 🧠 Simula receta
  const recipe = {
    title: "Pasta con verduras",
    author: params.user,
    image: "/branding/banner-home.png",
    difficulty: "fácil",
    time: 25,
    content: `
      1. Lava y corta las verduras.
      2. Saltea en una sartén con aceite de oliva.
      3. Agrega la pasta cocida y mezcla.
      4. Añade sal, pimienta y un toque de limón.
    `,
  };

  if (!recipe) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Reveal>
        <motion.h1
          className="text-4xl font-display text-cocorico-red mb-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {recipe.title}
        </motion.h1>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="text-sm text-neutral-500 mb-6">
          Publicado por <span className="font-semibold">{recipe.author}</span> • {recipe.time} min
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <Image
          src={recipe.image}
          alt={recipe.title}
          width={800}
          height={400}
          className="rounded-xl shadow-md mb-6"
        />
      </Reveal>

      <Reveal delay={0.2}>
        <Badge color={recipe.difficulty === "fácil" ? "green" : recipe.difficulty === "media" ? "amber" : "red"}>
          {recipe.difficulty}
        </Badge>
      </Reveal>

      <Reveal delay={0.25}>
        <Card className="mt-6 bg-white dark:bg-neutral-900">
          <CardContent>
            <pre className="whitespace-pre-wrap text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed">
              {recipe.content}
            </pre>
          </CardContent>
        </Card>
      </Reveal>
    </main>
  );
}
