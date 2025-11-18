'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Recipe, Visibility } from '@/types/recipes';
import { Clock, Users, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEMO_RECIPES = [
  {
    title: 'Paella Valenciana',
    description: 'Arroz con mariscos, pollo y verduras al estilo tradicional valenciano.',
    image: '/branding/cocorico/chef.png',
    prepTime: '30 min',
    cookTime: '45 min',
    servings: 6
  },
  {
    title: 'Gazpacho Andaluz',
    description: 'Sopa fría de tomate, pepino y pimientos perfecta para el verano.',
    image: '/branding/cocorico/cocorico-cooking.png',
    prepTime: '15 min',
    cookTime: '0 min',
    servings: 4
  },
  {
    title: 'Tortilla de Patatas',
    description: 'Clásica tortilla española con patatas y cebolla.',
    image: '/branding/cocorico/cocorico-smiling.png',
    prepTime: '10 min',
    cookTime: '25 min',
    servings: 4
  },
  {
    title: 'Ensalada César',
    description: 'Lechuga romana con pollo, parmesano y aderezo César casero.',
    image: '/branding/cocorico/happy.png',
    prepTime: '15 min',
    cookTime: '10 min',
    servings: 2
  },
  {
    title: 'Pasta Carbonara',
    description: 'Spaghetti con panceta, huevo, parmesano y pimienta negra.',
    image: '/branding/cocorico/chef.png',
    prepTime: '10 min',
    cookTime: '15 min',
    servings: 4
  },
  {
    title: 'Tacos al Pastor',
    description: 'Tacos mexicanos con cerdo marinado, piña y cilantro.',
    image: '/branding/cocorico/cocorico-cutting.png',
    prepTime: '20 min',
    cookTime: '30 min',
    servings: 6
  },
  {
    title: 'Sushi Rolls',
    description: 'Rolls de salmón, aguacate y pepino con arroz sushi.',
    image: '/branding/cocorico/thinking.png',
    prepTime: '40 min',
    cookTime: '20 min',
    servings: 4
  },
  {
    title: 'Lasaña Boloñesa',
    description: 'Capas de pasta con ragú de carne y bechamel gratinada.',
    image: '/branding/cocorico/default.png',
    prepTime: '30 min',
    cookTime: '60 min',
    servings: 8
  },
  {
    title: 'Pollo al Curry',
    description: 'Pollo en salsa de curry con leche de coco y especias.',
    image: '/branding/cocorico/chef.png',
    prepTime: '15 min',
    cookTime: '35 min',
    servings: 4
  },
  {
    title: 'Brownies de Chocolate',
    description: 'Brownies densos y chocolatosos con nueces.',
    image: '/branding/cocorico/happy.png',
    prepTime: '15 min',
    cookTime: '30 min',
    servings: 12
  },
  {
    title: 'Ramen Japonés',
    description: 'Sopa de fideos con caldo rico, huevo y verduras.',
    image: '/branding/cocorico/cocorico-cooking.png',
    prepTime: '25 min',
    cookTime: '40 min',
    servings: 4
  },
  {
    title: 'Pizza Margherita',
    description: 'Pizza clásica con tomate, mozzarella y albahaca fresca.',
    image: '/branding/cocorico/cocorico-smiling.png',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 4
  },
  {
    title: 'Fajitas de Res',
    description: 'Tiras de res salteadas con pimientos y cebolla.',
    image: '/branding/cocorico/cocorico-cutting.png',
    prepTime: '15 min',
    cookTime: '20 min',
    servings: 4
  },
  {
    title: 'Tiramisú Italiano',
    description: 'Postre de café, mascarpone y bizcochos de soletilla.',
    image: '/branding/cocorico/chef.png',
    prepTime: '30 min',
    cookTime: '0 min',
    servings: 8
  },
  {
    title: 'Pad Thai',
    description: 'Fideos de arroz salteados con camarones y cacahuates.',
    image: '/branding/cocorico/thinking.png',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 4
  },
  {
    title: 'Hamburguesa Gourmet',
    description: 'Burger de res con queso cheddar, bacon y aguacate.',
    image: '/branding/cocorico/happy.png',
    prepTime: '15 min',
    cookTime: '12 min',
    servings: 4
  },
  {
    title: 'Risotto de Hongos',
    description: 'Arroz cremoso con hongos porcini y parmesano.',
    image: '/branding/cocorico/cocorico-cooking.png',
    prepTime: '10 min',
    cookTime: '30 min',
    servings: 4
  },
  {
    title: 'Ceviche Peruano',
    description: 'Pescado marinado en limón con cebolla y cilantro.',
    image: '/branding/cocorico/default.png',
    prepTime: '20 min',
    cookTime: '0 min',
    servings: 6
  },
  {
    title: 'Tarta de Queso',
    description: 'Cheesecake cremoso con base de galleta y frutos rojos.',
    image: '/branding/cocorico/cocorico-smiling.png',
    prepTime: '25 min',
    cookTime: '50 min',
    servings: 10
  },
  {
    title: 'Shakshuka',
    description: 'Huevos pochados en salsa de tomate con especias.',
    image: '/branding/cocorico/chef.png',
    prepTime: '10 min',
    cookTime: '25 min',
    servings: 4
  }
];

export default function RecipesClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const locale = useLocale();

  const plan =
    typeof document !== "undefined"
      ? (document.documentElement.dataset.theme as "free" | "premium")
      : "free";

  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
      setShowDemo((data || []).length === 0);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={cn("p-8 rounded-2xl", plan === "premium" && "glass-card-premium")}>
          <p className={plan === "premium" ? "glass-text-premium" : ""}>Cargando recetas...</p>
        </div>
      </div>
    );
  }

  const displayRecipes = showDemo ? DEMO_RECIPES : recipes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-900/20 dark:to-yellow-900/30 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className={cn(
          "flex flex-col sm:flex-row justify-between items-center mb-8 p-6 rounded-3xl",
          plan === "premium" ? "glass-card-premium" : "bg-white/80 dark:bg-neutral-900/80 border border-orange-200 dark:border-orange-800"
        )}>
          <div>
            <h1 className={cn(
              "text-4xl font-bold mb-2",
              plan === "premium" ? "glass-text-premium" : "text-orange-900 dark:text-orange-300"
            )}>
              Mis Recetas 🍳
            </h1>
            <p className={plan === "premium" ? "text-white/80" : "text-muted-foreground"}>
              {showDemo ? '20 recetas demo para inspirarte' : `${recipes.length} recetas guardadas`}
            </p>
          </div>
          <button
            onClick={() => router.push(`/${locale}/recipes/new`)}
            className={cn(
              "mt-4 sm:mt-0 px-6 py-3 rounded-xl font-semibold transition-all",
              plan === "premium" 
                ? "glass-button-premium" 
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl"
            )}
          >
            <ChefHat className="inline w-5 h-5 mr-2" />
            Nueva Receta
          </button>
        </div>

        {/* Toggle Demo/Real */}
        {!showDemo && recipes.length > 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowDemo(true)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm",
                plan === "premium" ? "glass-droplet" : "bg-amber-100 text-amber-800"
              )}
            >
              Ver recetas demo
            </button>
          </div>
        )}
        {showDemo && recipes.length > 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowDemo(false)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm",
                plan === "premium" ? "glass-droplet" : "bg-amber-100 text-amber-800"
              )}
            >
              Ver mis recetas ({recipes.length})
            </button>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {showDemo ? (
            // Demo recipes
            DEMO_RECIPES.map((recipe, idx) => (
              <div
                key={idx}
                className={cn(
                  "group overflow-hidden rounded-2xl transition-all hover:scale-105 cursor-pointer",
                  plan === "premium" ? "glass-card-premium" : "bg-white dark:bg-neutral-900 border border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-2xl"
                )}
                onClick={() => router.push(`/${locale}/recipes/new`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className={cn(
                    "text-lg font-bold mb-2",
                    plan === "premium" ? "glass-text-premium" : "text-orange-900 dark:text-orange-300"
                  )}>
                    {recipe.title}
                  </h3>
                  <p className={cn(
                    "text-sm mb-4 line-clamp-2",
                    plan === "premium" ? "text-white/70" : "text-neutral-600 dark:text-neutral-400"
                  )}>
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Real recipes from DB
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                className={cn(
                  "overflow-hidden rounded-2xl transition-all hover:scale-105",
                  plan === "premium" ? "glass-card-premium" : "bg-white dark:bg-neutral-900 border border-orange-200 dark:border-orange-800 shadow-lg hover:shadow-2xl"
                )}
              >
                <div className="p-6">
                  <h2 className={cn(
                    "text-xl font-bold mb-2",
                    plan === "premium" ? "glass-text-premium" : "text-orange-900 dark:text-orange-300"
                  )}>
                    {recipe.title}
                  </h2>
                  <p className={cn(
                    "mb-4 line-clamp-2",
                    plan === "premium" ? "text-white/70" : "text-neutral-600 dark:text-neutral-400"
                  )}>
                    {recipe.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-lg",
                      plan === "premium" ? "glass-droplet" : "bg-orange-100 text-orange-800"
                    )}>
                      {recipe.visibility === Visibility.PUBLIC ? 'Pública' : 'Privada'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/${locale}/recipes/${recipe.id}`)}
                        className={cn(
                          "text-sm px-3 py-1 rounded-lg",
                          plan === "premium" ? "glass-droplet" : "text-blue-600 hover:bg-blue-50"
                        )}
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => router.push(`/${locale}/recipes/${recipe.id}/edit`)}
                        className={cn(
                          "text-sm px-3 py-1 rounded-lg",
                          plan === "premium" ? "glass-droplet" : "text-green-600 hover:bg-green-50"
                        )}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('¿Estás seguro de eliminar esta receta?')) {
                            deleteRecipe(recipe.id);
                          }
                        }}
                        className={cn(
                          "text-sm px-3 py-1 rounded-lg",
                          plan === "premium" ? "glass-droplet" : "text-red-600 hover:bg-red-50"
                        )}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {recipes.length === 0 && !showDemo && (
          <div className={cn(
            "text-center mt-10 p-12 rounded-3xl",
            plan === "premium" ? "glass-card-premium" : "bg-white/80 dark:bg-neutral-900/80"
          )}>
            <p className={cn(
              "text-lg mb-6",
              plan === "premium" ? "glass-text-premium" : "text-neutral-600 dark:text-neutral-400"
            )}>
              No hay recetas todavía.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/recipes/new`}
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold transition-all",
                  plan === "premium" ? "glass-button-premium" : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                )}
              >
                Crear receta
              </Link>
              <Link
                href={`/${locale}/dashboard/import`}
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold transition-all",
                  plan === "premium" ? "glass-button-premium" : "border-2 border-amber-500 text-amber-600 hover:bg-amber-50"
                )}
              >
                Importar desde URL/Foto
              </Link>
              <Link
                href={`/${locale}/recipes/search`}
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold transition-all",
                  plan === "premium" ? "glass-button-premium" : "border-2 border-neutral-300 hover:bg-neutral-50"
                )}
              >
                Buscar recetas
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
