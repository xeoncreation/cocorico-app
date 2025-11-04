import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecipeCard({
  title, slug, image, difficulty, time, excerpt
}: {
  title: string;
  slug: string;
  image?: string;
  difficulty?: "fácil" | "media" | "difícil";
  time?: number; // minutos
  excerpt?: string;
}) {
  return (
    <Card className="overflow-hidden">
      {image ? (
        <Image src={image} alt={title} width={800} height={500} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-amber-50" />
      )}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-cocorico-brown">{title}</h3>
        </div>
        <div className="text-sm text-neutral-700">
          <div className="flex items-center gap-2 mb-2">
            {difficulty && (
              <Badge className={
                difficulty === "fácil"
                  ? "bg-emerald-100 text-emerald-800 border-transparent"
                  : difficulty === "media"
                  ? "bg-amber-100 text-amber-800 border-transparent"
                  : "bg-rose-100 text-rose-800 border-transparent"
              }>
                {difficulty}
              </Badge>
            )}
            {time != null && (
              <Badge className="bg-gray-100 text-gray-700 border-transparent">{time} min</Badge>
            )}
          </div>
          {excerpt && <p className="text-sm text-neutral-700 line-clamp-2">{excerpt}</p>}
        </div>
        <div className="mt-3 pt-3 border-t">
          <Link href={`/r/public/${slug}`} className="text-cocorico-red font-medium hover:underline">
            Ver receta →
          </Link>
        </div>
      </div>
    </Card>
  );
}
