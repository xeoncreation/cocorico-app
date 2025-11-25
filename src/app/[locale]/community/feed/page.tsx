import GlassCard from "@/components/ui/GlassCard";
import Wallpaper from "@/components/layout/Wallpaper";

// import RecipeFeedCard from "@/components/community/RecipeFeedCard"; // To be created for enhanced recipe display

export default async function FeedPage({ params }: { params: { locale: string } }) {
  // TODO: Replace with actual DB fetch
  const recipes = [
    { id: 1, title: "Receta 1", description: "Descripción de la receta 1" },
    { id: 2, title: "Receta 2", description: "Descripción de la receta 2" },
    { id: 3, title: "Receta 3", description: "Descripción de la receta 3" },
  ];

  return (
    <>
      <Wallpaper
        imageLight="/branding/FEED_MODO_CLARO.jpg"
        imageDark="/branding/FEED_MODO_OSCURO.jpg"
      />
      <div className="space-y-4">
        <h1 className="text-3xl font-bold glass-text-strong">Feed de Recetas</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {recipes.map(recipe => (
            <GlassCard key={recipe.id} className="p-6">
              <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
              <p className="glass-text-medium mb-2">{recipe.description}</p>
              <div className="flex gap-2 mt-2">
                <button className="glass-pill px-3 py-1 bg-amber-400 text-white font-bold">👍 Me gusta</button>
                <a href={`/recipes/${recipe.id}`} className="glass-pill px-3 py-1 bg-blue-500 text-white font-bold">Ver receta</a>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  );
}
